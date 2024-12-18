from configs.database import db
from models.test_data import TestResults

async def matrix_handler():
    test_model_collection = db["Test_Chats"]
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
    data = TestResults(**data)
    data_dict = data.dict()
    del data_dict["totalPrompts"]
    return data_dict