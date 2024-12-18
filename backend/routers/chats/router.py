from fastapi import APIRouter, HTTPException
from routers.chats.handler.chats_handler import fetch_user_chats,insert_or_update_chat
from models.chats import Chat
from typing import List

router = APIRouter()

@router.get("/getChats/{userid}", response_model=List[Chat])
async def get_user_chats(userid: str):
    try:
        chats = await fetch_user_chats(userid)
        return chats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chats: {e}")

@router.post("/addchats")
async def add_chat(chat: Chat):
    try:
        chat_data = chat.model_dump()
        result = await insert_or_update_chat(chat_data)
        if result:
            return {"message": "Chat added successfully"}
        return {"message": "Failed to add chat"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding chat: {e}")
