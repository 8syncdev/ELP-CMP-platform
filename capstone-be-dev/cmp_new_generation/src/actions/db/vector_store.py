from .mistral_embeddings import MistralAIEmbeddings
from langchain_postgres import PGVector
from ...settings import API_KEY_EMBEDDING, MODEL_NAME_EMBEDDING, DATABASE_URL
from langchain_core.documents import Document
# lib to create random uuid
import uuid
import time
import logging
from functools import wraps
from sqlalchemy.exc import OperationalError, ProgrammingError
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Retry decorator for database operations


def db_retry_decorator(max_attempts=3, min_wait=1, max_wait=10):
    return retry(
        retry=retry_if_exception_type((OperationalError, ProgrammingError)),
        stop=stop_after_attempt(max_attempts),
        wait=wait_exponential(multiplier=1, min=min_wait, max=max_wait),
        reraise=True,
        before_sleep=lambda retry_state: logger.warning(
            f"Database operation failed, retrying in {retry_state.next_action.sleep} seconds... "
            f"Attempt {retry_state.attempt_number}/{max_attempts}")
    )


# Initialize embeddings with retry-enabled wrapper
embeddings = MistralAIEmbeddings(
    api_key=API_KEY_EMBEDDING,
    model=MODEL_NAME_EMBEDDING,
)

collection_name = "my_docs"

# Function to get a fresh vector store connection


def get_vector_store():
    try:
        return PGVector(
            embeddings=embeddings,
            connection=DATABASE_URL,
            collection_name=collection_name,
            use_jsonb=True,
        )
    except Exception as e:
        logger.error(f"Failed to create vector store connection: {str(e)}")
        raise


def create_document(text: str, location: str, topic: str):
    return Document(
        page_content=text,
        metadata={
            "location": location,
            "topic": topic,
            "id": str(uuid.uuid4()),
        }
    )


@db_retry_decorator()
def save_to_vector_store(docs: list[Document]):
    """Save documents to vector store with retry mechanism"""
    if not docs:
        logger.warning("No documents to save")
        return

    try:
        # Get fresh connection
        vector_store = get_vector_store()
        vector_store.add_documents(
            docs, ids=[doc.metadata["id"] for doc in docs])
        logger.info(
            f"Successfully saved {len(docs)} documents to vector store")
    except Exception as e:
        logger.error(f"Error saving to vector store: {str(e)}")
        raise


@db_retry_decorator()
def get_from_vector_store(query: str, location: list[str]):
    """Get documents from vector store with retry mechanism"""
    if not query or not location:
        logger.warning("Invalid query or location")
        return None

    try:
        # Get fresh connection
        vector_store = get_vector_store()
        result = vector_store.similarity_search(
            query, k=5, filter={"location": {"$in": location}})
        return result[0].page_content if result else None
    except Exception as e:
        logger.error(f"Error querying vector store: {str(e)}")
        # Return None instead of raising to prevent application crash
        return None
