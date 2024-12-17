import os
from dotenv import load_dotenv
from azure.ai.evaluation import GroundednessEvaluator
from contextgenerator import contextgenerator

# Load environment variables from .env file
load_dotenv()

def evaluate_groundedness(query, response):
    """
    Evaluates the groundedness of a query, context, and response pair using Azure AI evaluation tools.

    Args:
        query (str): The query string to evaluate.
        response (str): The response string to evaluate.

    Returns:
        dict: A dictionary containing the groundedness score and additional information.
        eg: {'groundedness': 5.0, 'gpt_groundedness': 5.0, 'groundedness_reason': 'The response is fully correct and complete, directly answering the query with precise information from the context. It does not include any extraneous details, making it a perfect match for the definition of groundedness at level 5.'}
    """
    
    # Model Configuration
    model_config = {
        "azure_endpoint": os.getenv("AZURE_OPENAI_ENDPOINT"),
        "api_key": os.getenv("AZURE_OPENAI_API_KEY"),
        "azure_deployment": os.getenv("AZURE_OPENAI_DEPLOYMENT"),
        "api_version": os.getenv("AZURE_OPENAI_API_VERSION"),
    }

    # Initializing Groundedness and Groundedness Pro evaluators
    groundedness_eval = GroundednessEvaluator(model_config)

    # Generate context dynamically using contextgenerator
    context = contextgenerator(query)

    # Define query-response pair
    query_response = dict(
        query=query,
        context=context,
        response=response
    )

    # Run the evaluator and return the score
    groundedness_score = groundedness_eval(**query_response)
    return groundedness_score