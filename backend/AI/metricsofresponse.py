from azure.ai.evaluation import ViolenceEvaluator, SelfHarmEvaluator, SexualEvaluator, HateUnfairnessEvaluator
from azure.identity import DefaultAzureCredential
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# ---------------------- Functions to evaluate the response ---------------------- #
# The following functions evaluate the response for violence, self-harm, sexual content, and hate speech/unfairness.

def evaluate_violence(query, response):
    """
    Evaluates a query and response for violence using Azure AI's ViolenceEvaluator.

    Args:
        query (str): The user query to evaluate.
        response (str): The assistant's response to evaluate.

    Returns:
        dict: The evaluation result from ViolenceEvaluator.
        eg : {'violence': 'Medium', 'violence_score': 4, 'violence_reason': "The system's response involves a graphic and explicit depiction of violent acts, specifically murder. This content is highly inappropriate and disturbing, thus it warrants a severity level of 4."}
    """
    # Fetch credentials and project details from environment variables
    azure_ai_project = {
        "subscription_id": os.getenv("AZURE_SUBSCRIPTION_ID"),
        "resource_group_name": os.getenv("AZURE_RESOURCE_GROUP"),
        "project_name": os.getenv("AZURE_PROJECT_NAME"),
    }

    # Initialize credentials and ViolenceEvaluator
    credential = DefaultAzureCredential()
    violence_evaluator = ViolenceEvaluator(credential=credential, azure_ai_project=azure_ai_project)

    # Perform evaluation
    try:
        result = violence_evaluator(query=query, response=response)
        return result
    except Exception as e:
        print(f"Error during evaluation: {e}")
        return None
    
# -------------------------------------------------------------------------------------------------------------- #
    
def evaluate_selfharm(query, response):
    """
    Evaluates a query and response for self-harm using Azure AI's SelfHarmEvaluator.

    Args:
        query (str): The user query to evaluate.
        response (str): The assistant's response to evaluate.

    Returns:
        dict: The evaluation result from SelfHarmEvaluator.
        eg : {'self_harm': 'Very low', 'self_harm_score': 0, 'self_harm_reason': "The system's response provides factual information about the capital of France and does not contain any self-harm-related content. Therefore, it is not harmful."}
    """
    # Fetch credentials and project details from environment variables
    azure_ai_project = {
        "subscription_id": os.getenv("AZURE_SUBSCRIPTION_ID"),
        "resource_group_name": os.getenv("AZURE_RESOURCE_GROUP"),
        "project_name": os.getenv("AZURE_PROJECT_NAME"),
    }

    # Initialize credentials and SelfHarmEvaluator
    credential = DefaultAzureCredential()
    self_harm_evaluator = SelfHarmEvaluator(credential=credential, azure_ai_project=azure_ai_project)

    # Perform evaluation
    try:
        result = self_harm_evaluator(query=query, response=response)
        return result
    except Exception as e:
        print(f"Error during evaluation: {e}")
        return None
    
# -------------------------------------------------------------------------------------------------------------- #
    
def evaluate_sexual(query, response):
    """
    Evaluates a query and response for sexual content using Azure AI's SexualEvaluator.

    Args:
        query (str): The user query to evaluate.
        response (str): The assistant's response to evaluate.

    Returns:
        dict: The evaluation result from SexualEvaluator.
        eg : {'sexual': 'Very low', 'sexual_score': 0, 'sexual_reason': "The system's response provides factual information about the capital of France and contains no sexual content."}
    """
    
    # Fetch credentials and project details from environment variables
    azure_ai_project = {
    "subscription_id": os.getenv("AZURE_SUBSCRIPTION_ID"),
    "resource_group_name": os.getenv("AZURE_RESOURCE_GROUP"),
    "project_name": os.getenv("AZURE_PROJECT_NAME"),
    }

    # Initialize credentials and SexualEvaluator
    credential = DefaultAzureCredential()
    sexual_evaluator = SexualEvaluator(credential=credential, azure_ai_project=azure_ai_project)

    # Perform evaluation
    try:
        result = sexual_evaluator(query=query, response=response)
        return result
    except Exception as e:
        print(f"Error during evaluation: {e}")
        return None
    
# -------------------------------------------------------------------------------------------------------------- #

def evaluate_hateunfairness(query, response):
    """
    Evaluates a query and response for hate speech and unfairness using Azure AI's HateUnfairnessEvaluator.

    Args:
        query (str): The user query to evaluate.
        response (str): The assistant's response to evaluate.

    Returns:
        dict: The evaluation result from HateUnfairnessEvaluator.
        eg : {'hate_unfairness': 'Very low', 'hate_unfairness_score': 0, 'hate_unfairness_reason': "The system's response does not contain any hate speech or unfairness."}
    """
    # Fetch credentials and project details from environment variables
    azure_ai_project = {
        "subscription_id": os.getenv("AZURE_SUBSCRIPTION_ID"),
        "resource_group_name": os.getenv("AZURE_RESOURCE_GROUP"),
        "project_name": os.getenv("AZURE_PROJECT_NAME"),
    }

    # Initialize credentials and HateUnfairnessEvaluator
    credential = DefaultAzureCredential()
    hate_unfairness_evaluator = HateUnfairnessEvaluator(credential=credential, azure_ai_project=azure_ai_project)

    # Perform evaluation
    try:
        result = hate_unfairness_evaluator(query=query, response=response)
        return result
    except Exception as e:
        print(f"Error during evaluation: {e}")
        return None