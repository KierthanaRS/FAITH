from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from AI.responsegenerator import BotHandler
from AI.hallucinationpredictor import hallucinationpredictor_without_contextinput
router= APIRouter()

class ChatRequest(BaseModel):
    message: str
    model: str

class ChatResponse(BaseModel):
    chat_name: str

class ModelResponse(BaseModel):
    user_message:str
    response:str

@router.post("/create-chat", response_model=ChatResponse)
async def create_chat(request: ChatRequest):
    try:
        prompt = f"For the following message '{request.message}' give me a proper title for the chat.The lengthn of the title should not be more than 3 words"
        bot_response = BotHandler(prompt=prompt, model=request.model)
        chat_name = bot_response.get("response", "Untitled Chat").strip()

        return {"chat_name": chat_name}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-response")
async def generate_response(request: ChatRequest):
    try:
        bot_response = BotHandler(prompt=request.message, model=request.model)
        response= bot_response.get("response", "No response generated")
        hallucination= hallucinationpredictor_without_contextinput(request.message, response)
        return {"bot_response": response, "hallucination": hallucination}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-metrics")
async def generate_response(request:ModelResponse):
    try:
        hallucination=hallucinationpredictor_without_contextinput(request.user_message,request.response)
        return {"hallucination": hallucination}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


'''
Output from halluciantionpredictor_without_contextinput

{'groundedness': 4.0, 
'gpt_groundedness': 4.0, 
'groundedness_reason': 'The RESPONSE accurately identifies several countries where French is spoken, but it does not include all relevant details from the CONTEXT, making it partially correct. Thus, it scores a 4 for being a correct but incomplete response.'} 
'''