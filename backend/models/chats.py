from pydantic import BaseModel

class ChatMessage(BaseModel):
    usermsg: str
    botmsg: str
    metrics: dict

class Chat(BaseModel):
    userid: str
    modelName: dict  
