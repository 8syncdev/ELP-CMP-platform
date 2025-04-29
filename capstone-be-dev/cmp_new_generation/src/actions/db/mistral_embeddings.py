from langchain_mistralai import MistralAIEmbeddings as BaseMistralAIEmbeddings
from ...settings import API_KEY_EMBEDDING, MODEL_NAME_EMBEDDING
import httpx
import logging
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from typing import List, Optional, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MistralAIEmbeddings(BaseMistralAIEmbeddings):
    """
    A wrapper around the MistralAIEmbeddings class that adds retry logic 
    for HTTPStatusError (especially 429 rate limit errors).
    """

    def __init__(
        self,
        api_key: Optional[str] = API_KEY_EMBEDDING,
        model: str = MODEL_NAME_EMBEDDING,
        **kwargs: Any,
    ) -> None:
        """Initialize the MistralAIEmbeddings wrapper."""
        super().__init__(api_key=api_key, model=model, **kwargs)
        logger.info(f"Initialized MistralAIEmbeddings with model {model}")

    @retry(
        retry=retry_if_exception_type(
            (httpx.TimeoutException, httpx.HTTPStatusError)),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        before_sleep=lambda retry_state: logger.warning(
            f"MistralAI API call failed, retrying in {retry_state.next_action.sleep} seconds... "
            f"Attempt {retry_state.attempt_number}/3"
        )
    )
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Embed documents with retry for rate limiting and connection issues.

        Args:
            texts: The list of texts to embed.

        Returns:
            List of embeddings, one for each text.
        """
        try:
            return super().embed_documents(texts)
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                logger.warning("Rate limit exceeded. Retrying...")
            raise
        except Exception as e:
            logger.error(f"Error embedding documents: {str(e)}")
            raise

    @retry(
        retry=retry_if_exception_type(
            (httpx.TimeoutException, httpx.HTTPStatusError)),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        before_sleep=lambda retry_state: logger.warning(
            f"MistralAI API call failed, retrying in {retry_state.next_action.sleep} seconds... "
            f"Attempt {retry_state.attempt_number}/3"
        )
    )
    def embed_query(self, text: str) -> List[float]:
        """
        Embed query text with retry for rate limiting and connection issues.

        Args:
            text: The text to embed.

        Returns:
            Embeddings for the text.
        """
        try:
            return super().embed_query(text)
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                logger.warning("Rate limit exceeded. Retrying...")
            raise
        except Exception as e:
            logger.error(f"Error embedding query: {str(e)}")
            raise
