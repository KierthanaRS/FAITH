from AI.hallucinationpredictor import hallucinationpredictor

async def test_model_handler(query: str, response: str, context: str, result: str):
    groundednessResult = hallucinationpredictor(query, response, context)
    print(groundednessResult)
    return groundednessResult