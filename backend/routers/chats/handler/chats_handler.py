from configs.database import db
from models.chats import Chat
from typing import List

async def get_chats_by_userid(userid: str) -> List[Chat]:
   
    chats_cursor = db["chats"].find({"userid": userid})
    chats = await chats_cursor.to_list(length=None)
    if not chats:
        return []
    parsed_chats = [Chat(**chat) for chat in chats]
    return parsed_chats

async def fetch_user_chats(userid: str) -> List[Chat]:
    try:
        chats = await get_chats_by_userid(userid)
        return chats
    except Exception as e:
        print(f"Error fetching chats: {e}")
        return []

async def insert_chat(chat: Chat):
    try:
        await db["chats"].insert_one(chat.dict())
    except Exception as e:
        print(f"Error inserting chat: {e}")
        return False