from langchain_mistralai import ChatMistralAI as BaseChatMistralAI
from ...settings import API_KEY, MODEL_NAME
import httpx
import logging
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from typing import Any, Dict, List, Mapping, Optional, Union
from langchain_core.callbacks.manager import CallbackManagerForLLMRun
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    ChatMessage,
    HumanMessage,
    SystemMessage,
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ChatMistralAI(BaseChatMistralAI):
    """
    A wrapper around the ChatMistralAI class that adds retry logic 
    for HTTPStatusError (especially 429 rate limit errors).
    """

    def __init__(
        self,
        api_key: Optional[str] = API_KEY,
        model: str = MODEL_NAME,
        **kwargs: Any,
    ) -> None:
        """Initialize the ChatMistralAI wrapper."""
        super().__init__(api_key=api_key, model=model, **kwargs)
        logger.info(f"Initialized ChatMistralAI with model {model}")

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
    def _generate(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> Any:
        """
        Generate chat completion with retry for rate limiting and connection issues.

        Args:
            messages: The messages to use for chat completion.
            stop: Sequences that immediately terminate generation.
            run_manager: Callback manager for LLM run.
            **kwargs: Additional arguments for the API call.

        Returns:
            Chat completion result.
        """
        try:
            return super()._generate(messages, stop, run_manager, **kwargs)
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                logger.warning("Rate limit exceeded. Retrying...")
            raise
        except Exception as e:
            logger.error(f"Error in chat completion: {str(e)}")
            raise
