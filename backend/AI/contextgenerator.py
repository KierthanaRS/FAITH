import os
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# --------------------------------------------------------------------------------------------------------- #

def contextgenerator(query, max_results=5):
    """
    Fetches search results from Bing API and generates context by fetching page contents.

    Args:
        query (str): The search query to find context for.
        max_results (int): Number of results to fetch.

    Returns:
        str: A generated context summary from the top search results.
    """
    load_dotenv()  # Load environment variables from .env file

    # Get the API key and endpoint from environment variables
    BING_API_KEY = os.getenv("BING_API_KEY")
    BING_ENDPOINT = os.getenv("BING_ENDPOINT")

    if not BING_API_KEY:
        raise ValueError("BING_API_KEY not found. Ensure it's set in the .env file.")

    headers = {
        "Ocp-Apim-Subscription-Key": BING_API_KEY
    }
    params = {
        "q": query,
        "count": max_results,
        "mkt": "en-US"
    }

    try:
        # Send API request to Bing Search
        response = requests.get(BING_ENDPOINT, headers=headers, params=params)
        response.raise_for_status()

        search_results = response.json()
        context = []

        # Extract relevant parts of the search results
        for idx, result in enumerate(search_results.get("webPages", {}).get("value", [])):
            name = result.get("name", "No title")
            url = result.get("url", "")

            page_content = fetch_page_content(url)

            if page_content:
                context.append(f"{idx + 1}. {name} ({url}):\n{page_content}\n")
            else:
                context.append(f"{idx + 1}. {name} ({url}):\n[Content could not be fetched.]\n")

        # Combine all into a summary
        return "\n".join(context) if context else "No results found."

    except requests.exceptions.RequestException as e:
        return f"Error fetching context: {e}"
    
# --------------------------------------------------------------------------------------------------------- #
    
def fetch_page_content(url):
    """
    Fetches the content of a web page and extracts text.

    Args:
        url (str): The URL of the page to fetch.

    Returns:
        str: Extracted text content from the page.
    """
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        
        if response.status_code == 403:
            return None

        # Parse the HTML content
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract all visible text from the page
        texts = soup.stripped_strings
        page_content = " ".join(texts)
        return page_content[:2000]  # Limit content to first 2000 characters for brevity

    except requests.exceptions.RequestException:
        return None