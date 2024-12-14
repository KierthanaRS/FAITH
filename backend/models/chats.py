from pydantic import BaseModel
from typing import Dict, List

class ChatMessage(BaseModel):
    usermsg: str
    botmsg: str
    metrics: Dict[str, str]

class Chat(BaseModel):
    userid: str
    modelName: str
    messages: List[ChatMessage]