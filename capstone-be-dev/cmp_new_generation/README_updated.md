# 🌐 CMP Communication Model Protocol

## 📑 Mục lục
- [Tổng quan dự án](#tổng-quan-dự-án)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Phân tích kiến trúc chi tiết](#phân-tích-kiến-trúc-chi-tiết)
- [Thành phần chính](#thành-phần-chính)
- [Kiến trúc module Actions](#kiến-trúc-module-actions)
- [Phân tích chi tiết các module](#phân-tích-chi-tiết-các-module)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt và chạy](#cài-đặt-và-chạy)
- [API Endpoints](#api-endpoints)
- [Tài liệu tham khảo](#tài-liệu-tham-khảo)
- [Thông tin liên hệ](#thông-tin-liên-hệ)

## 🌟 Tổng quan dự án

CMP (Communication Model Protocol) là một dự án được phát triển bởi Nguyễn Phương Anh Tú, được lấy cảm hứng từ MCP (Model Context Protocol). Dự án này tạo ra một hệ thống API cho phép mô phỏng cuộc trò chuyện giữa giáo viên và sinh viên để hỗ trợ quá trình học tập.

### Mục tiêu chính
- Xây dựng một nền tảng hỗ trợ học tập thông qua tương tác AI
- Cung cấp thông tin có dẫn nguồn thông qua tìm kiếm web tự động
- Mô phỏng tương tác giáo viên-sinh viên với ngữ cảnh phong phú
- Hỗ trợ đa ngôn ngữ (Tiếng Việt và Tiếng Anh)

### Đặc điểm nổi bật
- **Tìm kiếm thông minh**: Tự động tìm kiếm Google để thu thập thông tin
- **Tóm tắt tự động**: Xử lý và tóm tắt thông tin từ nhiều nguồn
- **Mô hình hội thoại**: Mô phỏng tương tác giáo viên-sinh viên
- **Trả lời có dẫn nguồn**: Kèm theo nguồn thông tin đáng tin cậy
- **Tích hợp Vector Store**: Lưu trữ và truy xuất thông tin hiệu quả

## 🏗️ Kiến trúc hệ thống

```mermaid
graph TB
    Client[Client Application] --> API[FastAPI Backend]
    
    subgraph Backend["Backend Services"]
        API --> Router[Routers Module]
        Router --> Actions[Actions Module]
        
        subgraph ActionsModule["Actions Components"]
            Actions --> Chains[Chains Module]
            Actions --> Contexts[Contexts Module]
            Actions --> Database[Database Module]
            Actions --> Summarization[Summarization Module]
        end
        
        Chains --> LLMIntegration[LLM Integration]
        Contexts --> WebScraping[Web Scraping]
        Database --> VectorStore[Vector Storage]
        Summarization --> TextProcessing[Text Processing]
    end
    
    subgraph ExternalServices["External Services"]
        LLMIntegration --> MistralAI[Mistral AI]
        LLMIntegration --> Langchain[Langchain]
        WebScraping --> GoogleSearch[Google Search API]
        WebScraping --> ContentExtraction[URL Content Extraction]
        VectorStore --> PostgreSQL[PostgreSQL + pgvector]
    end
    
    style Backend fill:#f5f5f5,stroke:#333,stroke-width:1px
    style ActionsModule fill:#e1f5fe,stroke:#333,stroke-width:1px
    style ExternalServices fill:#f9f9f9,stroke:#333,stroke-width:1px
```

## 🔬 Phân tích kiến trúc chi tiết

CMP được thiết kế theo kiến trúc module hóa có tính mở rộng cao, được phân chia thành các lớp chức năng rõ ràng:

### Kiến trúc phân lớp

```mermaid
graph TB
    subgraph "Presentation Layer"
        FastAPI["FastAPI Application"] --> Routers["Routers Module"]
        FastAPI --> Middlewares["Middleware (CORS, Rate Limit)"]
    end
    
    subgraph "Business Logic Layer"
        Routers --> Actions["Actions Module"]
        Actions --> Chains["LLM Chains"]
        Actions --> CTXs["Context Processing"]
        Actions --> Summarize["Text Summarization"]
    end
    
    subgraph "Data Access Layer"
        Actions --> DB["Database Module"]
        DB --> VectorStore["Vector Storage"]
        DB --> ModelStorage["Model Cache Storage"]
    end
    
    subgraph "External Services Layer"
        Chains --> MistralAI["Mistral AI API"]
        CTXs --> GoogleAPI["Google Search API"]
        CTXs --> WebScraper["Web Content Scraper"]
    end
    
    style "Presentation Layer" fill:#f5f5f5,stroke:#333,stroke-width:1px
    style "Business Logic Layer" fill:#e1f5fe,stroke:#333,stroke-width:1px
    style "Data Access Layer" fill:#e8f5e9,stroke:#333,stroke-width:1px
    style "External Services Layer" fill:#fff8e1,stroke:#333,stroke-width:1px
```

### Luồng dữ liệu chính

```mermaid
sequenceDiagram
    participant Client
    participant FastAPI
    participant Router
    participant Action
    participant Context
    participant LLM
    participant Google
    participant Summarizer
    participant VectorDB
    
    Client->>FastAPI: HTTP Request
    FastAPI->>Router: Route Request
    Router->>Action: Execute Action
    
    alt Student asks question
        Action->>Context: Generate Context
        Context->>Google: Search Query
        Google-->>Context: Search Results
        Context->>Context: Extract Content from URLs
        Context-->>Action: Raw Context
        Action->>Summarizer: Summarize Context
        Summarizer-->>Action: Summarized Context
        Action->>VectorDB: Store Context Vectors
    end
    
    Action->>LLM: Generate Response (with Context)
    LLM-->>Action: AI Response
    Action-->>Router: Action Result
    Router-->>FastAPI: API Response
    FastAPI-->>Client: HTTP Response
```

## 📊 Thành phần chính

### 1. API Backend (FastAPI)
- **Endpoint chính**: `/cmp-actions`
- **Rate Limiting**: Hệ thống có 2 cấp độ giới hạn tốc độ: `normal` (150 req/min) và `mcp` (250 req/min)
- **Xử lý CORS**: Cho phép các ứng dụng web khác nhau tương tác với API
- **Middlewares**: Rate limiting, error handling, logging, và CORS management

**Cấu hình FastAPI chính:**
```python
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="CMP API", description="Communication Model Protocol API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting configuration
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Routers
app.include_router(main_router, prefix="/cmp-actions", tags=["CMP Actions"])
```

### 2. Luồng làm việc chi tiết
1. **Thu thập thông tin**:
   - Tìm kiếm Google với câu hỏi của sinh viên
   - Đánh giá và lựa chọn 5 liên kết có liên quan nhất
   - Trích xuất nội dung từ các liên kết, bao gồm xử lý HTML và text

2. **Xử lý ngữ cảnh**:
   - Tóm tắt nội dung từng trang web
   - Kết hợp thông tin từ các nguồn
   - Loại bỏ thông tin trùng lặp hoặc không liên quan

3. **Tương tác AI**:
   - Giáo viên (AI) truy cập thông tin tóm tắt
   - Phân tích câu hỏi của sinh viên
   - Tạo câu trả lời có cấu trúc, dễ hiểu

4. **Lưu trữ và truy xuất**:
   - Lưu trữ context, câu hỏi và câu trả lời dưới dạng vectors
   - Sử dụng similarity search để truy xuất thông tin liên quan

```mermaid
flowchart TD
    A[Câu hỏi sinh viên] --> B{Cần tìm kiếm?}
    B -->|Có| C[Tìm kiếm Google]
    B -->|Không| G[Sử dụng context có sẵn]
    
    C --> D[Lấy URLs từ kết quả]
    D --> E[Trích xuất nội dung]
    E --> F[Tóm tắt nội dung]
    F --> G
    
    G --> H[Tạo prompt cho LLM]
    H --> I[Gọi Mistral AI API]
    I --> J[Xử lý câu trả lời]
    J --> K[Trả kết quả về client]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style G fill:#bbf,stroke:#333,stroke-width:2px
    style K fill:#bfb,stroke:#333,stroke-width:2px
```

## 📋 Kiến trúc module Actions

Module Actions là trái tim của hệ thống CMP, vận hành theo mô hình kiến trúc module cấp cao với các sub-module chuyên biệt:

```mermaid
graph TD
    Root[actions/__init__.py] --> Chains[chains/]
    Root --> CTXs[ctxs/]
    Root --> DB[db/]
    Root --> Summarize[summarize/]
    
    subgraph "chains/"
        Chains --> LLMs[llms.py]
        Chains --> Templates[templates.py]
        Chains --> MistralChat[mistral_chat.py]
        Chains --> Libs[libs.py]
    end
    
    subgraph "ctxs/"
        CTXs --> Google[gg.py]
    end
    
    subgraph "db/"
        DB --> VectorStore[vector_store.py]
        DB --> Embeddings[mistral_embeddings.py]
    end
    
    subgraph "summarize/"
        Summarize --> SummarizeImpl[summarize.py]
        Summarize --> Tokenizer[tokenizer.py]
    end
    
    style Root fill:#f9f9f9,stroke:#333,stroke-width:2px
    style "chains/" fill:#e1f5fe,stroke:#333,stroke-width:1px
    style "ctxs/" fill:#e8f5e9,stroke:#333,stroke-width:1px
    style "db/" fill:#fff8e1,stroke:#333,stroke-width:1px
    style "summarize/" fill:#f3e5f5,stroke:#333,stroke-width:1px
```

### Mô hình thiết kế
- **Mô hình Modular**: Phân tách rõ ràng các chức năng thành các module độc lập, dễ bảo trì
- **Factory Pattern**: Sử dụng trong `chains/llms.py` để khởi tạo các LLM chain với cấu hình linh hoạt
- **Dependency Injection**: Truyền các dependency qua tham số hàm, tăng khả năng test và tái sử dụng
- **Singleton Pattern**: Áp dụng cho các kết nối cơ sở dữ liệu và mô hình embedding để tối ưu tài nguyên
- **Repository Pattern**: Trừu tượng hóa tương tác với cơ sở dữ liệu qua các interface
- **Service Layer Pattern**: Tách biệt logic nghiệp vụ khỏi cơ sở hạ tầng

## 🧩 Phân tích chi tiết các module

### 1. Module Chains
Module này quản lý tương tác với các mô hình ngôn ngữ lớn (LLM) và định nghĩa các prompt template.

#### `llms.py`
Khởi tạo và cấu hình các LLM chain, sử dụng Factory Pattern để tạo ra các instance với cấu hình khác nhau.

**Mô hình dữ liệu chính:**
```python
class LLMConfig:
    def __init__(
        self,
        model_name: str,
        temperature: float = 0.7,
        max_tokens: int = 1024,
        top_p: float = 0.9,
        top_k: int = 50,
        api_key: str = None
    ):
        self.model_name = model_name
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.top_p = top_p
        self.top_k = top_k
        self.api_key = api_key or os.getenv("API_KEY")
```

**Factory method cho LLM chains:**
```python
def create_llm_chain(
    config: LLMConfig,
    prompt_template: str,
    output_parser: Optional[BaseOutputParser] = None
) -> LLMChain:
    """Factory method để tạo LLM chain với cấu hình tùy chỉnh"""
    llm = ChatMistralAI(
        model=config.model_name,
        temperature=config.temperature,
        max_tokens=config.max_tokens,
        top_p=config.top_p,
        mistral_api_key=config.api_key
    )
    
    prompt = PromptTemplate.from_template(prompt_template)
    
    return LLMChain(
        llm=llm,
        prompt=prompt,
        output_parser=output_parser,
        verbose=True
    )
```

#### `templates.py`
Định nghĩa các prompt template cho các tác vụ khác nhau, giúp LLM hiểu ngữ cảnh và tạo câu trả lời phù hợp.

**Ví dụ template cho vai trò giáo viên:**
```python
TEACHER_TEMPLATE = """
Bạn là một giáo viên có kinh nghiệm và chuyên nghiệp, đang trả lời câu hỏi của học sinh.

Context thông tin:
{context}

Câu hỏi của học sinh: {question}

Hãy trả lời câu hỏi của học sinh một cách rõ ràng, đầy đủ và dễ hiểu.
Nếu không đủ thông tin để trả lời, hãy nói rõ và có thể gợi ý học sinh nên tìm hiểu thêm ở đâu.
Nếu câu hỏi liên quan đến code, hãy cung cấp ví dụ code cụ thể và giải thích.

Câu trả lời của giáo viên:
"""
```

### 2. Module CTXs
Module xử lý ngữ cảnh và thu thập thông tin từ các nguồn bên ngoài.

#### `gg.py`
Tìm kiếm Google và trích xuất nội dung từ các URL, sử dụng kỹ thuật web scraping.

**Hàm tìm kiếm Google:**
```python
async def search_google(query: str, num_results: int = 5) -> List[Dict[str, str]]:
    """Tìm kiếm Google và trả về danh sách kết quả"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
    }
    
    search_url = f"https://www.google.com/search?q={quote_plus(query)}&num={num_results}&hl=en"
    
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.get(search_url) as response:
            if response.status != 200:
                raise Exception(f"Google search failed with status {response.status}")
            
            html = await response.text()
            soup = BeautifulSoup(html, "html.parser")
            
            search_results = []
            for result in soup.select(".tF2Cxc"):
                title_element = result.select_one("h3")
                link_element = result.select_one("a")
                
                if title_element and link_element:
                    title = title_element.get_text()
                    link = link_element.get("href")
                    if link.startswith("/url?q="):
                        link = link.split("/url?q=")[1].split("&sa=")[0]
                    
                    search_results.append({
                        "title": title,
                        "url": link
                    })
            
            return search_results[:num_results]
```

**Trích xuất nội dung từ URL:**
```python
async def extract_content_from_url(url: str) -> str:
    """Trích xuất nội dung văn bản từ URL"""
    try:
        downloaded = trafilatura.fetch_url(url)
        if downloaded:
            content = trafilatura.extract(downloaded, include_links=True, include_comments=False)
            if content:
                return content
        
        # Fallback method using BeautifulSoup if trafilatura fails
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        }
        
        async with aiohttp.ClientSession(headers=headers) as session:
            async with session.get(url) as response:
                if response.status != 200:
                    return ""
                
                html = await response.text()
                soup = BeautifulSoup(html, "html.parser")
                
                # Remove unwanted elements
                for tag in soup(["script", "style", "nav", "footer", "header"]):
                    tag.decompose()
                
                text = soup.get_text(separator="\n")
                lines = [line.strip() for line in text.splitlines() if line.strip()]
                return "\n".join(lines)
    except Exception as e:
        logger.error(f"Error extracting content from {url}: {str(e)}")
        return ""
```

### 3. Module DB
Quản lý lưu trữ dữ liệu và tương tác với Vector Store.

#### `vector_store.py`
Interface với PostgreSQL Vector Store để lưu trữ và truy vấn vector.

**Mô hình dữ liệu chính:**
```python
class VectorData:
    def __init__(
        self,
        id: str,
        text: str,
        metadata: Dict[str, Any],
        embedding: List[float] = None
    ):
        self.id = id
        self.text = text
        self.metadata = metadata
        self.embedding = embedding
```

**Lớp Repository cho Vector Store:**
```python
class VectorRepository:
    def __init__(self, db_url: str, embedding_model: Any):
        self.db_url = db_url
        self.embedding_model = embedding_model
        self.engine = create_engine(db_url)
        
        # Initialize database if needed
        self._init_db()
    
    def _init_db(self):
        # Create tables if they don't exist
        with self.engine.connect() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS vector_store (
                    id TEXT PRIMARY KEY,
                    text TEXT NOT NULL,
                    metadata JSONB NOT NULL,
                    embedding vector(1024) NOT NULL
                )
            """))
            
            # Create index for similarity search
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS vector_store_embedding_idx
                ON vector_store
                USING ivfflat (embedding vector_l2_ops)
                WITH (lists = 100)
            """))
    
    @db_retry_decorator
    def insert_vector(self, vector_data: VectorData) -> bool:
        # Generate embedding if not provided
        if not vector_data.embedding:
            vector_data.embedding = self.embedding_model.embed_query(vector_data.text)
        
        with self.engine.connect() as conn:
            result = conn.execute(
                text("""
                    INSERT INTO vector_store (id, text, metadata, embedding)
                    VALUES (:id, :text, :metadata, :embedding)
                    ON CONFLICT (id) DO UPDATE
                    SET text = :text, metadata = :metadata, embedding = :embedding
                """),
                {
                    "id": vector_data.id,
                    "text": vector_data.text,
                    "metadata": json.dumps(vector_data.metadata),
                    "embedding": vector_data.embedding
                }
            )
            
            return result.rowcount > 0
    
    @db_retry_decorator
    def similarity_search(
        self,
        query: str,
        top_k: int = 5,
        metadata_filter: Dict[str, Any] = None
    ) -> List[VectorData]:
        query_embedding = self.embedding_model.embed_query(query)
        
        filter_clause = ""
        filter_params = {}
        
        if metadata_filter:
            filter_conditions = []
            for i, (key, value) in enumerate(metadata_filter.items()):
                filter_conditions.append(f"metadata->>{key} = :filter_value_{i}")
                filter_params[f"filter_value_{i}"] = value
            
            if filter_conditions:
                filter_clause = "WHERE " + " AND ".join(filter_conditions)
        
        query_sql = f"""
            SELECT id, text, metadata, embedding <-> :query_embedding AS distance
            FROM vector_store
            {filter_clause}
            ORDER BY distance
            LIMIT :top_k
        """
        
        params = {
            "query_embedding": query_embedding,
            "top_k": top_k,
            **filter_params
        }
        
        with self.engine.connect() as conn:
            result = conn.execute(text(query_sql), params)
            
            vectors = []
            for row in result:
                vectors.append(VectorData(
                    id=row.id,
                    text=row.text,
                    metadata=json.loads(row.metadata),
                    embedding=row.embedding
                ))
            
            return vectors
```

### 4. Module Summarize
Module tóm tắt văn bản, sử dụng các thuật toán và kỹ thuật xử lý ngôn ngữ tự nhiên.

#### `summarize.py`
Tóm tắt văn bản sử dụng thuật toán LSA (Latent Semantic Analysis).

**Hàm tóm tắt chính:**
```python
def summarize_text(text: str, language: str = "vietnamese", sentences_count: int = 10) -> str:
    """Tóm tắt văn bản thành số câu được chỉ định sử dụng LSA"""
    if not text or len(text) < 100:
        return text
    
    try:
        # Clean text
        text = clean_text(text)
        
        # Tokenize for Vietnamese
        if language.lower() == "vietnamese":
            parser = PlaintextParser.from_string(text, Tokenizer(language))
        else:
            parser = PlaintextParser.from_string(text, Tokenizer(language))
        
        # Apply LSA summarization
        summarizer = LsaSummarizer()
        summarizer.stop_words = get_stop_words(language)
        
        # Get summary
        summary_sentences = summarizer(parser.document, sentences_count)
        summary = " ".join([str(sentence) for sentence in summary_sentences])
        
        return summary
    except Exception as e:
        logger.error(f"Summarization error: {str(e)}")
        # Return truncated original text if summarization fails
        return truncate_text(text, max_chars=1000)
```

## 🛠️ Công nghệ sử dụng

### Backend
- **FastAPI**: Framework API hiệu năng cao, dễ sử dụng
- **Uvicorn**: ASGI server cho FastAPI
- **SQLModel**: ORM hiện đại kết hợp SQLAlchemy và Pydantic
- **Slowapi**: Rate limiting middleware

### AI/ML
- **Langchain**: Framework tích hợp LLM vào ứng dụng
- **Mistral AI**: Mô hình ngôn ngữ tiên tiến
- **PostgreSQL + pgvector**: Lưu trữ và tìm kiếm vector

### Xử lý văn bản
- **Sumy**: Thư viện tóm tắt văn bản tự động
- **Trafilatura**: Web scraping để trích xuất nội dung sạch
- **NLTK & spaCy**: Xử lý ngôn ngữ tự nhiên
- **YouTube Transcript API**: Lấy phụ đề từ video YouTube

### Công cụ phụ trợ
- **aiohttp**: HTTP client không đồng bộ
- **BeautifulSoup4**: Phân tích HTML/XML
- **pydantic**: Xác thực dữ liệu
- **python-dotenv**: Quản lý biến môi trường

## 📥 Cài đặt và chạy

### 1. Yêu cầu hệ thống
- Python 3.9+
- PostgreSQL với extension pgvector
- Kết nối internet cho Google Search

### 2. Cài đặt dependencies:
```bash
pip install -r requirements.txt
```

### 3. Thiết lập biến môi trường (tạo file `.env` với nội dung tương tự):
```plaintext
API_KEY=your_mistral_api_key
API_KEY_EMBEDDING=your_embedding_api_key
MODEL_NAME=mistral-large-latest
MODEL_NAME_EMBEDDING=mistral-embed
DATABASE_URL=postgresql://username:password@localhost:5432/cmp_db
```

### 4. Chạy server:
```bash
python main.py
```

Ứng dụng sẽ chạy tại `http://0.0.0.0:8000`

### 5. Triển khai với Docker
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "main.py"]

EXPOSE 8000
```

### 6. Triển khai lên Vercel
File `vercel.json` được cấu hình để triển khai ứng dụng lên nền tảng Vercel:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "main.py"
    }
  ],
  "env": {
    "PYTHONUNBUFFERED": "1"
  }
}
```

## 🌐 API Endpoints

### 1. `/cmp-actions/search-google`
Tìm kiếm Google với từ khóa.

**Request:**
```json
{
  "query": "Làm thế nào để học lập trình Python hiệu quả",
  "num_results": 5
}
```

**Response:**
```json
{
  "results": [
    {
      "title": "10 cách học lập trình Python hiệu quả cho người mới bắt đầu",
      "url": "https://example.com/python-learning-tips"
    },
    // ...more results
  ]
}
```

### 2. `/cmp-actions/get-content-from-url`
Trích xuất nội dung từ URL.

**Request:**
```json
{
  "url": "https://example.com/python-learning-tips"
}
```

**Response:**
```json
{
  "content": "Nội dung đã trích xuất từ URL...",
  "metadata": {
    "source": "https://example.com/python-learning-tips",
    "title": "10 cách học lập trình Python hiệu quả cho người mới bắt đầu"
  }
}
```

### 3. `/cmp-actions/summarize`
Tóm tắt văn bản.

**Request:**
```json
{
  "text": "Văn bản dài cần tóm tắt...",
  "language": "vietnamese",
  "sentences_count": 5
}
```

**Response:**
```json
{
  "summary": "Văn bản đã được tóm tắt..."
}
```

### 4. `/cmp-actions/ask-teacher`
Hỏi giáo viên (với context).

**Request:**
```json
{
  "question": "Làm thế nào để tạo một hàm trong Python?",
  "context": "Python là ngôn ngữ lập trình cấp cao, dễ học với cú pháp rõ ràng..."
}
```

**Response:**
```json
{
  "answer": "Để tạo một hàm trong Python, bạn sử dụng từ khóa 'def' theo sau là tên hàm và dấu ngoặc đơn. Ví dụ:\n\n```python\ndef hello_world():\n    print('Hello, World!')\n```\n\nBạn có thể thêm tham số và giá trị trả về cho hàm...",
  "metadata": {
    "sources": [
      "https://example.com/python-learning-tips"
    ]
  }
}
```

### 5. `/cmp-actions/meeting-with-teacher`
Tạo cuộc họp với giáo viên.

**Request:**
```json
{
  "student_question": "Tôi muốn học về Machine Learning, tôi nên bắt đầu từ đâu?"
}
```

**Response:**
```json
{
  "teacher_response": "Để bắt đầu với Machine Learning, bạn nên:\n\n1. Học vững Python cơ bản\n2. Nắm vững các kiến thức về Toán học (Đại số tuyến tính, Giải tích, Xác suất thống kê)\n3. Làm quen với các thư viện như NumPy, Pandas, Matplotlib\n4. Học các thuật toán ML cơ bản như Linear Regression, Decision Trees\n5. Thực hành với các bộ dữ liệu mẫu\n\nTôi khuyên bạn nên bắt đầu với khóa học online như...",
  "context_used": "Tóm tắt về Machine Learning...",
  "sources": [
    "https://example.com/machine-learning-beginners",
    "https://example.com/python-for-ml"
  ]
}
```

## 📚 Tài liệu tham khảo

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Langchain Documentation](https://python.langchain.com/docs/)
- [Mistral AI](https://mistral.ai/)
- [PostgreSQL Vector Search](https://www.postgresql.org/docs/current/pgsphere.html)
- [Text Summarization Techniques](https://towardsdatascience.com/text-summarization-techniques-d1e69e9a18d1)
- [Web Scraping Best Practices](https://www.scrapingbee.com/blog/web-scraping-best-practices/)

## 📞 Thông tin liên hệ

- **Tác giả**: Nguyễn Phương Anh Tú
- **YouTube**: [https://www.youtube.com/@Dev8Sync/featured](https://www.youtube.com/@Dev8Sync/featured)
- **Facebook**: [https://www.facebook.com/8sync](https://www.facebook.com/8sync)
- **TikTok**: [https://www.tiktok.com/@8_sync](https://www.tiktok.com/@8_sync)
- **Zalo**: [https://zalo.me/0703930513](https://zalo.me/0703930513)
- **Zalo Group**: [https://zalo.me/g/mitxdi486](https://zalo.me/g/mitxdi486)
- **Email**: 8sync.dev.1111@gmail.com
- **Website**: [https://8syncdev.com/](https://8syncdev.com/)
