from pydantic import BaseModel
from typing import List, Union, Optional

# Request models


class QueryRequest(BaseModel):
    query: str
    start_num: Optional[int] = 0
    num_results: Optional[int] = 5


class UrlRequest(BaseModel):
    url: str


class UrlsRequest(BaseModel):
    urls: List[str]


class TextRequest(BaseModel):
    text: str


class QuestionRequest(BaseModel):
    question: str

# Response models


class ActionResponse(BaseModel):
    success: bool
    result: Union[str, List[str]]
