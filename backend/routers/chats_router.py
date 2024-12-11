from fastapi import APIRouter, HTTPException
from backend.configs.database import db
from backend.models.chats import Chat

router = APIRouter()

@router.get("/chats/{chat_id}")
async def get_chat(chat_id: str):
    chat = await db["chats"].find_one({"_id": chat_id})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat

@router.get("/chats/{model_name}/{chat_id}")
async def get_chat(model_name: str, chat_id: str):
    result = await db["chats"].find_one(
        {f"{model_name}.{chat_id}": {"$exists": True}}, 
        {f"{model_name}.{chat_id}": 1, "_id": 0}
    )
    if not result:
        return {"error": "Chat not found"}
    return result