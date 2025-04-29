from .libs import *
from fastapi import Depends
from typing import Annotated
from src.settings import MODEL_NAME, API_KEY
from .templates import *
from typing import Literal
from .mistral_chat import ChatMistralAI
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

str_parser = StrOutputParser()

# Create LLM instance with built-in retry for rate limiting
llm = ChatMistralAI(
    api_key=API_KEY,
    model=MODEL_NAME,
)


def get_chains(
    llm: BaseLLM,
    template: PromptTemplate,
):
    return (
        template | llm | str_parser
    )


alex_professor_it = get_chains(
    llm=llm,
    template=template_alex_professor_it,
)

alice_student_it = get_chains(
    llm=llm,
    template=template_alice_student_it,
)

generate_links_from_question = get_chains(
    llm=llm,
    template=template_generate_links_from_question,
)


def select_chain(
    type: Literal["alex_professor_it", "alice_student_it", "generate_links_from_question"],
):
    if type == "alex_professor_it":
        return alex_professor_it
    elif type == "alice_student_it":
        return alice_student_it
    elif type == "generate_links_from_question":
        return generate_links_from_question
