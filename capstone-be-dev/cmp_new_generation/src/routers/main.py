import re
from fastapi import APIRouter, Depends, HTTPException
from ..actions import *
from .schemas import QueryRequest, UrlRequest, UrlsRequest, TextRequest, QuestionRequest, ActionResponse
from ..settings import BRAND_INSTRUCTION
from src.rate_limit import RateLimiter
import logging
from urlextract import URLExtract

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def rate_limit_normal():
    return RateLimiter(times=30, seconds=60*2)


def rate_limit_mcp():
    return RateLimiter(times=30, seconds=3600//2)


def rate_unlimit():
    return


DepsLimiterNormal = Depends(rate_limit_normal)
DepsLimiterMCP = Depends(rate_limit_mcp)

actions_router = APIRouter(
    prefix="/cmp-actions",
    tags=["CMP Actions"]
)

"""
Workflow:
Đầu tiên tìm kiếm trên google với câu hỏi của sinh viên
Từ kết quả tìm kiếm, lấy ra 5 link liên quan đến câu hỏi của sinh viên
Từ 5 link, lấy ra nội dung của từng link
Từ nội dung của từng link, tóm tắt thành 1 đoạn văn ngắn
Giáo viện: sẽ xem nội dung tóm tắt và trả lời câu hỏi của sinh viên
Sinh viên: sẽ đặt câu hỏi tiếp theo dựa trên câu trả lời của giáo viên

Số lần lặp lại: 3-5 lần tùy theo yêu cầu từ bên frontend.
"""

DB_SAVE_VECTOR_STORE = True  # False khi muốn test response nhiều lần.
extractor = URLExtract()


def extract_questions(text: str) -> list[str]:
    """
    Extract questions from text comprehensively in both Vietnamese and English.

    This function detects:
    1. Questions ending with question marks
    2. Questions starting with question words
    3. Numbered questions
    4. Implicit questions without question marks
    5. Core information requests in conversational text

    Args:
        text: Input text that may contain questions

    Returns:
        List of extracted questions
    """
    if not text:
        return []

    questions = []

    # Clean text - normalize spaces and line breaks
    cleaned_text = re.sub(r'\s+', ' ', text).strip()

    # Split into sentences for better analysis
    sentences = re.split(r'(?<=[.!?])\s+|[|;]', cleaned_text)
    sentences = [s.strip() for s in sentences if s.strip()]

    # English question words (expanded)
    en_question_words = r'\b(what|why|how|when|where|who|which|whose|whom|can|could|would|will|is|are|do|does|did|has|have|should|may|might|explain|tell|describe|elaborate|clarify|discuss|advise)\b'

    # Vietnamese question words (expanded)
    vn_question_words = r'\b(gì|sao|làm sao|khi nào|ở đâu|ai|tại sao|bao giờ|như thế nào|cái gì|vì sao|có phải|làm thế nào|hãy|là gì|thế nào|cho biết|giải thích|trình bày|nói về|là ai|thể nào)\b'

    question_word_pattern = f"({en_question_words}|{vn_question_words})"

    # Pattern 1: Extract explicit questions with question marks
    for s in sentences:
        if s.endswith('?'):
            questions.append(s)

    # Pattern 2: Extract questions starting with question words (without relying on question marks)
    for s in sentences:
        if re.match(question_word_pattern, s.lower()) and s not in questions:
            questions.append(s)

    # Pattern 3: Extract implicit questions using request phrases
    request_phrases_en = [
        r'\b(I\s+(?:want|need|would like)\s+to\s+(?:know|understand|learn))',
        r'\b((?:Can|Could)\s+you\s+(?:explain|tell|clarify|help))',
        r'\b((?:Please|Kindly)\s+(?:explain|tell|clarify|advise))',
        r'\b(I\'m\s+(?:confused|unclear|interested)\s+about)',
        r'\b((?:not|don\'t)\s+understand\s+how)',
        r'(what\s+is|how\s+to|how\s+can)'
    ]

    request_phrases_vi = [
        r'\b((?:tôi|mình|em)\s+(?:muốn|cần|chưa)\s+(?:biết|hiểu))',
        r'\b((?:bạn|thầy|anh|chị|cô|anh|em)\s+(?:có thể|vui lòng|hãy)\s+(?:giải thích|cho biết|nói về))',
        r'\b((?:xin|làm ơn|vui lòng)\s+(?:giải thích|cho biết|nói))',
        r'\b((?:chưa|không|còn)\s+(?:rõ|hiểu|biết))',
        r'\b((?:là gì|để làm gì|làm sao))'
    ]

    all_request_patterns = request_phrases_en + request_phrases_vi

    for s in sentences:
        if s in questions:
            continue

        for pattern in all_request_patterns:
            if re.search(pattern, s.lower()):
                questions.append(s)
                break

    # Pattern 4: Look for topic-focused sentences that mention key concepts
    # This is useful when people ask about a topic without explicit question structure
    # Like "Nextjs là gì" (What is NextJS)
    if not questions:
        # Extract sentences with keywords/topics and common information request patterns
        topic_request_patterns = [
            # Vietnamese: "X là gì", "X dùng để làm gì"
            r'([a-zA-Z0-9_\-]+\s+(?:là gì|là ai|là cái gì|dùng để làm gì))',
            # English: "what is X", "how to use X"
            r'((?:what is|how to use|how to|how does)\s+[a-zA-Z0-9_\-]+)',
            # English: "X works", "X function"
            r'([a-zA-Z0-9_\-]+\s+(?:works|function|means|used for))',
        ]

        for s in sentences:
            for pattern in topic_request_patterns:
                if re.search(pattern, s.lower()):
                    questions.append(s)
                    break

    # Pattern 5: Look for sentences with "tôi vẫn chưa rõ" or "I'm still unclear" type phrases
    # These typically lead to the core question
    unclear_patterns = [
        # Vietnamese
        r'((?:tôi|mình|em)\s+(?:vẫn|còn|chưa)\s+(?:chưa|không)\s+(?:rõ|hiểu|biết))',
        # English
        r'((?:I|We)\s+(?:still|am|don\'t|do not)\s+(?:unclear|confused|understand|know))'
    ]

    for i, s in enumerate(sentences):
        for pattern in unclear_patterns:
            if re.search(pattern, s.lower()) and i < len(sentences) - 1:
                # The actual question likely follows this phrase
                next_sentence = sentences[i+1]
                if next_sentence not in questions:
                    questions.append(next_sentence)

    # Clean up questions
    cleaned_questions = []
    for q in questions:
        # Remove leading numbers and punctuation
        q = re.sub(r'^\d+\s*[.)]\s*', '', q.strip())

        # Remove common conversation starters like "Hello professor" or "Thank you for"
        q = re.sub(
            r'^(xin chào|cảm ơn|hello|thank you|hi|chào|kính gửi)[^.!?]+[,.]\s*', '', q, flags=re.IGNORECASE)

        if q and len(q) > 5:  # Ensure minimum length for a valid question
            cleaned_questions.append(q)

    # Extract the most probable core question
    # Priority:
    # 1. Question mark questions
    # 2. Direct request questions with "how", "what", etc.
    # 3. Sentences with key topic indicators

    core_questions = []

    # Priority 1: Question marks
    question_mark_questions = [q for q in cleaned_questions if q.endswith('?')]
    if question_mark_questions:
        core_questions.extend(question_mark_questions)

    # Priority 2: Questions with direct question words
    if not core_questions:
        for q in cleaned_questions:
            if re.match(question_word_pattern, q.lower()):
                core_questions.append(q)

    # If we have multiple core questions, prioritize based on relevance and specificity
    if len(core_questions) > 1:
        # Prefer questions with specific technical terms or topic indicators
        for q in core_questions:
            # Check for specific technical terms (adjust based on your domain)
            if re.search(r'\b(router|route|routing|nextjs|react|framework|javascript|phương pháp|cách|method)\b', q.lower()):
                return [q]

        # If no specific technical terms found, return the longest question as it's likely more detailed
        return [max(core_questions, key=len)]

    return core_questions if core_questions else cleaned_questions


def extract_only_questions(question_from_student: str, way: int = 1):
    """
    Extract only the question from the question_from_student
    """
    # Way 1:
    if way == 1:
        summa = question_from_student
        questions = summarize(
            " ".join(extract_questions(summa)), num_sentences=1)
        return questions
    # Way 2:
    if way == 2:
        summa = summarize(question_from_student, num_sentences=3)
        return summarize(" ".join(extract_questions(summa)), num_sentences=1)


@actions_router.post("/search-google", response_model=ActionResponse, dependencies=[DepsLimiterNormal])
async def search_google_actions(request: QueryRequest):
    """
    Search google with query
    """
    links: list[str] = []
    try:
        try:
            links: list[str] = search_google(
                extract_only_questions(request.query), num_results=request.num_results, start_num=request.start_num)
            if not links:
                # Try to extract questions from the question_from_student
                questions = extract_only_questions(request.query, way=2)
                links: list[str] = search_google(
                    questions, num_results=request.num_results, start_num=request.start_num)
        except Exception as e:
            logger.error(f"Error in search_google_actions: {str(e)}")

        try:
            if not links:
                generate_links_from_question = select_chain(
                    "generate_links_from_question").invoke({
                        "question_from_student": request.query
                    })
                links = extractor.find_urls(generate_links_from_question)[
                    :request.num_results]
        except Exception as e:
            logger.error(f"Error in search_google_actions: {str(e)}")

        if not links:
            return ActionResponse(
                success=False,
                result="No links found",
            )
        return ActionResponse(
            success=True,
            result=links,
        )
    except Exception as e:
        logger.error(f"Error in search_google_actions: {str(e)}")
        return ActionResponse(
            success=False,
            result=f"Error processing request: {str(e)}"
        )


@actions_router.post("/get-content-from-url", response_model=ActionResponse, dependencies=[DepsLimiterNormal])
async def get_content_from_url_actions(request: UrlRequest):
    """
    Get content from url
    """
    try:
        content: str = get_content_from_url(request.url)
        if not content:
            return ActionResponse(
                success=False,
                result="No content found",
            )
        return ActionResponse(
            success=True,
            result=content,
        )
    except Exception as e:
        logger.error(f"Error in get_content_from_url_actions: {str(e)}")
        return ActionResponse(
            success=False,
            result=f"Error processing request: {str(e)}"
        )


@actions_router.post("/get-content-from-urls", response_model=ActionResponse, dependencies=[DepsLimiterNormal])
async def get_content_from_urls_actions(request: UrlsRequest):
    """
    Get content from urls
    """
    try:
        content: list[str] = get_content_from_urls(request.urls)
        if not content:
            return ActionResponse(
                success=False,
                result="No content found",
            )
        return ActionResponse(
            success=True,
            result=content,
        )
    except Exception as e:
        logger.error(f"Error in get_content_from_urls_actions: {str(e)}")
        return ActionResponse(
            success=False,
            result=f"Error processing request: {str(e)}"
        )


@actions_router.post("/summarize", response_model=ActionResponse, dependencies=[DepsLimiterNormal])
async def summarize_actions(request: TextRequest):
    """
    Summarize text
    """
    try:
        summa = summarize(request.text)

        # Safe database operation
        if DB_SAVE_VECTOR_STORE:
            try:
                save_to_vector_store(
                    [create_document(summa, "summarize", "alex_professor_it")])
            except Exception as db_error:
                logger.error(
                    f"Database error in summarize_actions: {str(db_error)}")
                # Continue processing even if DB operation fails

        return ActionResponse(
            success=True,
            result=summa,
        )
    except Exception as e:
        logger.error(f"Error in summarize_actions: {str(e)}")
        return ActionResponse(
            success=False,
            result=f"Error processing request: {str(e)}"
        )


@actions_router.post("/ask-teacher", response_model=ActionResponse, dependencies=[DepsLimiterMCP])
async def ask_teacher_actions(request: QuestionRequest):
    """
    Ask teacher with question
    """
    try:
        # Get context safely with fallback to empty string
        try:
            context = get_from_vector_store(request.question, [
                "student_ask_teacher", "meeting_with_teacher", "ask_teacher", "summarize"]) or ""
        except Exception as db_error:
            logger.error(
                f"Database error getting context in ask_teacher_actions: {str(db_error)}")
            context = ""  # Fallback to empty context

        result = select_chain("alex_professor_it").invoke({
            "question_from_student": request.question,
            "context": context,
            "brand_instruction": BRAND_INSTRUCTION
        })

        # Safe database operation
        if DB_SAVE_VECTOR_STORE:
            try:
                save_to_vector_store(
                    [create_document(result, "ask_teacher", "alex_professor_it")])
            except Exception as db_error:
                logger.error(
                    f"Database error saving in ask_teacher_actions: {str(db_error)}")
                # Continue processing even if DB operation fails

        return ActionResponse(
            success=True,
            result=result,
        )
    except Exception as e:
        logger.error(f"Error in ask_teacher_actions: {str(e)}")
        return ActionResponse(
            success=False,
            result=f"Error processing request: {str(e)}"
        )


@actions_router.post("/meeting-with-teacher", response_model=ActionResponse, dependencies=[DepsLimiterMCP])
async def meeting_with_teacher_actions(request: QuestionRequest):
    """
    Meeting with teacher
    """
    try:
        # Get context safely with fallback to empty string
        try:
            context = get_from_vector_store(request.question, [
                "student_ask_teacher", "meeting_with_teacher", "ask_teacher", "summarize"]) or ""
        except Exception as db_error:
            logger.error(
                f"Database error getting context in meeting_with_teacher_actions: {str(db_error)}")
            context = ""  # Fallback to empty context

        result = select_chain("alex_professor_it").invoke({
            "question_from_student": request.question,
            "context": context,
            "brand_instruction": BRAND_INSTRUCTION
        })

        # Safe database operation
        if DB_SAVE_VECTOR_STORE:
            try:
                save_to_vector_store(
                    [create_document(result, "meeting_with_teacher", "alex_professor_it")])
            except Exception as db_error:
                logger.error(
                    f"Database error saving in meeting_with_teacher_actions: {str(db_error)}")
                # Continue processing even if DB operation fails

        return ActionResponse(
            success=True,
            result=result,
        )
    except Exception as e:
        logger.error(f"Error in meeting_with_teacher_actions: {str(e)}")
        return ActionResponse(
            success=False,
            result=f"Error processing request: {str(e)}"
        )


@actions_router.post("/student-ask-teacher", response_model=ActionResponse, dependencies=[DepsLimiterMCP])
async def student_ask_teacher_actions(request: QuestionRequest):
    """
    Student ask teacher
    """
    try:
        # Get answer safely with fallback to empty string
        try:
            answer_from_alex_professor_it = get_from_vector_store(request.question, [
                "meeting_with_teacher", "ask_teacher", "summarize"]) or ""
        except Exception as db_error:
            logger.error(
                f"Database error getting answer in student_ask_teacher_actions: {str(db_error)}")
            answer_from_alex_professor_it = ""  # Fallback to empty answer

        result = select_chain("alice_student_it").invoke({
            "question_from_student": request.question,
            "answer_from_alex_professor_it": answer_from_alex_professor_it,
            "brand_instruction": BRAND_INSTRUCTION
        })

        # Safe database operation
        if DB_SAVE_VECTOR_STORE:
            try:
                save_to_vector_store(
                    [create_document(result, "student_ask_teacher", "alice_student_it")])
            except Exception as db_error:
                logger.error(
                    f"Database error saving in student_ask_teacher_actions: {str(db_error)}")
                # Continue processing even if DB operation fails

        return ActionResponse(
            success=True,
            result=result,
        )
    except Exception as e:
        logger.error(f"Error in student_ask_teacher_actions: {str(e)}")
        return ActionResponse(
            success=False,
            result=f"Error processing request: {str(e)}"
        )


@actions_router.post("/extract-questions", response_model=ActionResponse, dependencies=[DepsLimiterNormal])
async def extract_questions_endpoint(request: TextRequest):
    """
    Extract questions from text in both Vietnamese and English
    """
    try:
        questions = extract_questions(request.text)
        return ActionResponse(
            success=True,
            result=questions,
        )
    except Exception as e:
        logger.error(f"Error in extract_questions_endpoint: {str(e)}")
        return ActionResponse(
            success=False,
            result=f"Error processing request: {str(e)}"
        )
