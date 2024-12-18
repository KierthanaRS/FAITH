from pydantic import BaseModel
from langchain_openai import AzureChatOpenAI
from langchain_community.callbacks import get_openai_callback
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def BotHandler(prompt: str, model: str, structure = {"prompt_template": "Answer the following question: {}"}):
    """
    Handles the communication with the Azure OpenAI model, processes the input prompt, and returns the model's response.
    
    Args:
        prompt (str): The question or input provided by the user. This is the main input to the model.
        model (str): The model to be used for generating the response. It is expected to be a string representing the model name.
        structure (dict, optional): A dictionary that contains a key `prompt_template`, which is used to format the prompt 
                                    for the model. Defaults to a template where the prompt is inserted into "Answer the following question: {}".

    Returns:
        dict: A dictionary containing the following keys:
            - "response" (str): The model's response to the formatted input prompt.
            - "cost" (float): The total cost incurred for generating the response.
            - "input_token" (int): The number of tokens used in the input prompt.
            - "response_token" (int): The number of tokens used in the model's response.
    
    Raises:
        Exception: If there is a KeyError due to invalid environment variables or an exception occurs during the API call.
    """
    # List of supported models
    supported_models = ["gpt-4o-mini", "gpt-4o", "gpt-4", "gpt-35-turbo-16k"]

    # Validate if the provided model is supported
    if model.lower() not in supported_models:
        raise Exception(f"Unsupported model: '{model}'. Supported models are: {', '.join(supported_models)}.")

    user_input = prompt
    structure = structure
    model = model.lower()

    try:
        # Dynamically set the environment variables based on the model name
        api_key = os.getenv(f"AZURE_OPENAI_API_KEY_{model.replace("-", "_")}")
        endpoint = os.getenv(f"AZURE_OPENAI_ENDPOINT_{model.replace("-", "_")}")
        deployment = os.getenv(f"AZURE_OPENAI_DEPLOYMENT_{model.replace("-", "_")}")
        api_version = os.getenv(f"AZURE_OPENAI_API_VERSION_{model.replace("-", "_")}")

        # Check if environment variables for the model are available
        if not all([api_key, endpoint, deployment, api_version]):
            raise Exception(f"Missing environment variables for model: {model}")

        # Initialize the model
        llm = AzureChatOpenAI(
            openai_api_key=api_key,
            azure_endpoint=endpoint,
            azure_deployment=deployment,
            api_version=api_version,
            temperature=0,
            max_tokens=200,
            timeout=None,
            max_retries=2,
        )
        
        # Single prompt-response handling without history
        formatted_prompt = structure.get("prompt_template", "{}").format(user_input)
        
        # Make API call and get response
        with get_openai_callback() as cb:
            output = llm.invoke(formatted_prompt)
            ret = output.content
            cost = cb.total_cost
            input_token = cb.prompt_tokens
            response_token = cb.completion_tokens

    except KeyError:
        raise Exception("Invalid model name or environment variables are not set properly")
    except Exception as e:
        raise Exception(str(e))
    
    return {
        "response": ret,
        "cost": cost,
        "input_token": input_token,
        "response_token": response_token
    }