from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel

from models.analytics import Analytics
from configs.database import db

from AI.responsegenerator import BotHandler
from AI.hallucinationpredictor import hallucinationpredictor_without_contextinput
from AI.metricsofresponse import evaluate_hateunfairness, evaluate_selfharm, evaluate_sexual, evaluate_violence
router= APIRouter()

class ChatRequest(BaseModel):
    message: str
    model: str

class ChatResponse(BaseModel):
    chat_name: str

class ModelResponse(BaseModel):
    user_message:str
    response:str
    model:str

def quality_generator(score:int):
    if score<=2:
        return "Very low"
    if score<=4:
        return "Low"
    if score<=6:
        return "Medium"
    if score<=8:
        return "High"
    return "Very high"


async def metrics_evaluator(query,response,model,halucination_score):
    print(query,response,model)
    halucination_score = str(int(halucination_score))
    hateunfairness = evaluate_hateunfairness(query,response)
    selfharm = evaluate_selfharm(query,response)
    sexual = evaluate_sexual(query,response)
    violence = evaluate_violence(query,response)
    
    hateunfairness_quality = quality_generator(
        hateunfairness["hate_unfairness_score"])
    selfharm_quality = quality_generator(selfharm["self_harm_score"])
    sexual_quality = quality_generator(sexual["sexual_score"])
    violence_quality = quality_generator(violence["violence_score"])
    
    # testing
    # hateunfairness_quality = "Very low"
    # selfharm_quality = "Very low"
    # sexual_quality = "Very low"
    # violence_quality = "Very low"
    # 

    analytics_collection = db["Analytics"]

    data = await analytics_collection.find_one({"modelName": model})

    if not data:
        data = Analytics(modelName=model)
        await analytics_collection.insert_one(data.dict())

    try:
        data = Analytics(**data)
    except Exception as e:
        pass

    data.promptCount = data.promptCount + 1
    data.hateUnfairnessMetricsCount[hateunfairness_quality] = data.hateUnfairnessMetricsCount[hateunfairness_quality] + 1
    data.selfHarmMetricsCount[selfharm_quality] = data.selfHarmMetricsCount[selfharm_quality] + 1
    data.sexualMetricsCount[sexual_quality] = data.sexualMetricsCount[sexual_quality] + 1
    data.violenceMetricsCount[violence_quality] = data.violenceMetricsCount[violence_quality] + 1
    data.hallucinationCount[halucination_score] = data.hallucinationCount[halucination_score] + 1

    await analytics_collection.update_one({"modelName": model}, {"$set": data.dict()})

@router.post("/create-chat", response_model=ChatResponse)
async def create_chat(request: ChatRequest):
    try:
        prompt = f"For the following message '{request.message}' give me a proper title for the chat.The lengthn of the title should not be more than 3 words"
        bot_response = BotHandler(prompt=prompt, model=request.model)
        chat_name = bot_response.get("response", "Untitled Chat").strip()

        return {"chat_name": chat_name}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-response")
async def generate_response(request: ChatRequest, background_tasks: BackgroundTasks):
    try:
        bot_response = BotHandler(prompt=request.message, model=request.model)
        response= bot_response.get("response", "No response generated")
        hallucination= hallucinationpredictor_without_contextinput(request.message, response)
        # await metrics_evaluator(request.message, response, request.model, hallucination['groundedness'])
        background_tasks.add_task(metrics_evaluator, request.message, response, request.model, hallucination['groundedness'])
        return {"bot_response": response, "hallucination": hallucination}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-metrics")
async def generate_response(request:ModelResponse, background_tasks: BackgroundTasks):
    try:
        hallucination=hallucinationpredictor_without_contextinput(request.user_message,request.response)
        # await metrics_evaluator(request.user_message, request.response, request.model, hallucination['groundedness'])
        background_tasks.add_task(metrics_evaluator, request.user_message, request.response, request.model, hallucination['groundedness'])
        return {"hallucination": hallucination}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


'''
Output from halluciantionpredictor_without_contextinput

{'groundedness': 4.0, 
'gpt_groundedness': 4.0, 
'groundedness_reason': 'The RESPONSE accurately identifies several countries where French is spoken, but it does not include all relevant details from the CONTEXT, making it partially correct. Thus, it scores a 4 for being a correct but incomplete response.'} 
'''