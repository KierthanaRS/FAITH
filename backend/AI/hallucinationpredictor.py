import os
from dotenv import load_dotenv
from azure.ai.evaluation import GroundednessEvaluator
from .AI.contextgenerator import contextgenerator
from langchain_openai import AzureChatOpenAI
from langchain_community.callbacks import get_openai_callback

# Load environment variables from .env file
load_dotenv()

# --------------------------------------------------------------------------------------------------------- #

def hallucinationpredictor_without_contextinput(query, response):
    """
    Evaluates the groundedness of a query, context, and response pair using Azure AI evaluation tools.

    Args:
        query (str): The query string to evaluate.
        response (str): The response string to evaluate.

    Returns:
        dict: A dictionary containing the groundedness score and additional information.
        eg: {'groundedness': 5.0, 'gpt_groundedness': 5.0, 'groundedness_reason': 'The response is fully correct and complete, directly answering the query with precise information from the context. It does not include any extraneous details, making it a perfect match for the definition of groundedness at level 5.'}
    """
    # Classify the prompt to determine the type of task
    prompttype = classify_prompt(query)
    if prompttype == "open-ended creative":
        return {"groundedness": 6.0, "gpt_groundedness": 6.0, "groundedness_reason": "The response to the above prompt is expected to be a type of intentional hallucination, as it is an open-ended creative task and does not require factual accuracy."}
    
    # Generate context dynamically using contextgenerator
    context = contextgenerator(query)

    return hallucinationpredictor(query, response, context)

# --------------------------------------------------------------------------------------------------------- #

def hallucinationpredictor(query, response, context):
    """
    Evaluates the groundedness of a query, context, and response pair using Azure AI evaluation tools.

    Args:
        query (str): The query string to evaluate.
        response (str): The response string to evaluate.
        context (str): The context string to evaluate.

    Returns:
        dict: A dictionary containing the groundedness score and additional information.
        eg: {'groundedness': 5.0, 'gpt_groundedness': 5.0, 'groundedness_reason': 'The response is fully correct and complete, directly answering the query with precise information from the context. It does not include any extraneous details, making it a perfect match for the definition of groundedness at level 5.'}
    """
    
    # Classify the prompt to determine the type of task
    prompttype = classify_prompt(query)
    if prompttype == "open-ended creative":
        return {"groundedness": 6.0, "gpt_groundedness": 6.0, "groundedness_reason": "The response to the above prompt is expected to be a type of intentional hallucination, as it is an open-ended creative task and does not require factual accuracy."}
    
    # Model Configuration
    model_config = {
        "azure_endpoint": os.getenv("AZURE_OPENAI_ENDPOINT"),
        "api_key": os.getenv("AZURE_OPENAI_API_KEY"),
        "azure_deployment": os.getenv("AZURE_OPENAI_DEPLOYMENT"),
        "api_version": os.getenv("AZURE_OPENAI_API_VERSION"),
    }

    # Initializing Groundedness and Groundedness Pro evaluators
    groundedness_eval = GroundednessEvaluator(model_config)

    # Define query-response pair
    query_response = dict(
        query=query,
        context=context,
        response=response
    )

    # Run the evaluator and return the score
    groundedness_score = groundedness_eval(**query_response)
    return groundedness_score

# --------------------------------------------------------------------------------------------------------- #

def classify_prompt(prompt: str):
    """
    Classifies the input prompt into one of the following categories:
    - "factual" (direct questions with a specific answer)
    - "fact-based creative" (creative tasks grounded in factual content)
    - "open-ended creative" (imaginative or artistic tasks with no factual context)

    Args:
        prompt (str): The user input prompt to classify.

    Returns:
        str: The classification category ("factual", "fact-based creative", or "open-ended creative").
    """
    
    # Fixed classification prompt template
    classification_prompt = f"""
    Classify the following prompt into one of the categories:
    1. "factual" - Direct questions or commands with a specific and verifiable answer.
    2. "fact-based creative" - Creative prompts that involve factual topics or entities (e.g., essays, descriptions).
    3. "open-ended creative" - Purely imaginative prompts without a factual basis (e.g., poems, fictional stories).

    Example classifications:
    - "Write a poem about love." → open-ended creative
    - "Generate a paragraph on the Taj Mahal." → fact-based creative
    - "What is the height of the Taj Mahal?" → factual
    - "Create a fantasy story." → open-ended creative
    - "Write an essay on climate change." → fact-based creative

    Classify this prompt:
    {prompt}
    """

    # Initialize communication with the Azure OpenAI model
    try:
        api_key = os.getenv("AZURE_OPENAI_API_KEY_gpt-4o-mini")
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT_gpt-4o-mini")
        deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_gpt-4o-mini")
        api_version = os.getenv("AZURE_OPENAI_API_VERSION_gpt-4o-mini")

        if not all([api_key, endpoint, deployment, api_version]):
            raise Exception("Missing environment variables for gpt-4o-mini")

        llm = AzureChatOpenAI(
            openai_api_key=api_key,
            azure_endpoint=endpoint,
            azure_deployment=deployment,
            api_version=api_version,
            temperature=0,
            max_tokens=50,
            timeout=None,
            max_retries=2,
        )

        # Format prompt for the model
        with get_openai_callback() as cb:
            output = llm.invoke(classification_prompt)
            ret = output.content.strip()

    except Exception as e:
        raise Exception(f"Error during prompt classification: {str(e)}")

    return ret