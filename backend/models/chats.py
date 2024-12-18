from pydantic import BaseModel
from typing import Dict, List,Union
class Metrics(BaseModel):
    hallucinationPercentage: Union[int, str]  # Allow both int and string
    reason: str
class ChatMessage(BaseModel):
    usermsg: str
    botmsg: str
    metrics: Metrics

class ChatHistory(BaseModel):
    # modelName: str
    chatid: str
    chatName: str
    messages: List[ChatMessage]

class ChatModel(BaseModel):
    modelName: str
    chat: List[ChatHistory]
class Chat(BaseModel):
    userid: str
    chat: List[ChatModel]