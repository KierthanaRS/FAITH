from configs.database import db
from models.chats import Chat
from models.chats import ChatModel
from models.chats import ChatMessage
from typing import List
from typing import Dict

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



async def insert_or_update_chat(data: Chat):
    try:
        # Check if the user exists
        userid = data.get("userid")
        modelName = data.get("chat")[0].get("modelName")
        user = await db["chats"].find_one({"userid": userid})

        if not user:
            # User doesn't exist, create a new entry
            await db["chats"].insert_one(data) 
            return {"message": "New user created with the provided chat data."}

        update_needed = False
        chat_list = user.get("chat", []) 
        model_found = False

        # Iterate through the chat models to find if the model already exists
        for model in chat_list:
            if model.get('modelName') == modelName:
                model_found = True
                for chat in model.get('chat'):
                    if chat.get('chatid') == data.get("chat")[0].get("chat")[0].get("chatid"):
                        new_message= ChatMessage(**data.get("chat")[0].get("chat")[0].get("messages")[0])
                        result = await db["chats"].update_one(
                            {
                                "userid": userid,
                                "chat.modelName": modelName,
                                "chat.chat.chatid": data.get("chat")[0].get("chat")[0].get("chatid")
                            },
                            {
                                "$push": {
                                    "chat.$[m].chat.$[c].messages": new_message.model_dump()
                                }
                            },
                            array_filters=[
                                {"m.modelName": modelName},
                                {"c.chatid": data.get("chat")[0].get("chat")[0].get("chatid")}
                            ],
                            upsert=True
                        )
                        update_needed = False
                        break
                else:
                    # Perform the update to add the new chat
                    new_chat_data = data.get("chat")[0].get("chat")[0]
                    result = await db["chats"].update_one(
                        {
                            "userid": userid, 
                            "chat.modelName": modelName  
                        },
                        {
                            "$push": {
                                "chat.$[m].chat": new_chat_data 
                            }
                        },
                        array_filters=[{"m.modelName": modelName}],  
                        upsert=True 
                    )

          
                    update_needed = False
                    break

        # If model doesn't exist, add a new model
        if not model_found:
            new_model = ChatModel(
                modelName=modelName,
                chat=[data.get('chat')[0].get('chat')[0]]  
            )
            chat_list.append(new_model.model_dump())  
            update_needed = True

        if update_needed:
   
            result = await db["chats"].update_one(
                {"userid": userid},
                {"$set": {"chat": chat_list}}  
            )
            if result.modified_count > 0:
                return {"message": "Chat data updated successfully."}

        return {"message": "No updates were made as the data already exists."}

    except Exception as e:
        print(f"Error inserting or updating chat: {e}")
        return {"message": "An error occurred while updating or inserting chat data.", "error": str(e)}




"""
Data from frontend for chats should be in this format
{
    "userid": "675af187fc14f57242759769",
    "chat": [
        {
            "modelName": "gpt-3.5",
            "chat": [
                {
                    "chatid": "675af187fc14f57242759770",
                    "chatName": "Second Chat with model 3.5",
                    "messages": [
                        {
                            "usermsg": "Hey there, how are you?",
                            "botmsg": "I am fine. How about you?",
                            "metrics": {
                                "hallucinationPercentage": 10,
                                "reason": "I am fine. How about you?",
                            }
                        }
                    ]
                }
            ]
        }
    ]
}


"""