from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from AI.responsegenerator import BotHandler

router= APIRouter()

class ChatRequest(BaseModel):
    message: str
    model: str

class ChatResponse(BaseModel):
    chat_name: str
    

@router.post("/create-chat", response_model=ChatResponse)
async def create_chat(request: ChatRequest):
    try:
        prompt = f"For the following message '{request.message}' give me a proper title for the chat"
        bot_response = BotHandler(prompt=prompt, model=request.model)
        chat_name = bot_response.get("response", "Untitled Chat").strip()

        return {"chat_name": chat_name}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-response")
async def generate_response(request: ChatRequest):
    try:
        bot_response = BotHandler(prompt=request.message, model=request.model)
        print(bot_response.get("response", "No response generated"))
        # Return only the bot response to match frontend expectations
        return {"bot_response": bot_response.get("response", "No response generated")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
