from AI.hallucinationpredictor import hallucinationpredictor
from models.test_data import TestResults
from configs.database import db

async def test_model_handler(query: str, response: str, context: str, result: str):
    groundednessResult = hallucinationpredictor(query, response, context)
    score = groundednessResult['groundedness']
    res = "Halucinating"
    if score >= 4:
        res = "Not Halucinating"
    test_model_collection = db["TestResults"]
    data = await test_model_collection.find_one({})
    if not data:
        data = TestResults(
            totalPrompts=0,
            TruePositives=0,
            TrueNegatives=0,
            FalsePositives=0,
            FalseNegatives=0
        )
        await test_model_collection.insert_one(data.dict())
    # data = TestResults(**data)
    if res == result and res == "Not Halucinating":
        data.TruePositives = data.TruePositives + 1
    elif res == result and res == "Halucinating":
        data.TrueNegatives = data.TrueNegatives + 1
    elif res != result and res == "Not Halucinating":
        data.FalsePositives = data.FalsePositives + 1
    elif res != result and res == "Halucinating":
        data.FalseNegatives = data.FalseNegatives + 1
    data.totalPrompts = data.totalPrompts + 1
    await test_model_collection.update_one({}, {"$set": data.dict()})
    return {"result": res, "user_result":result, "data": groundednessResult}