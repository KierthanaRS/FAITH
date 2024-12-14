from fastapi import APIRouter, HTTPException
from handler.chats_handler import fetch_user_chats
from models.chats import Chat
from typing import List

router = APIRouter()

@router.get("/chats/user/{userid}", response_model=List[Chat])
async def get_user_chats(userid: str):
    try:
        chats = await fetch_user_chats(userid)
        return chats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chats: {e}")
