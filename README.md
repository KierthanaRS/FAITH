<div>
<img src="assets\microsoft-removebg-preview.png" height="100" width="400" alt="Logo"/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="assets\azure-removebg-preview.png" height="100" width="300" alt="Logo" />
</div>

<center>
<h1>FAITH : Framework for AI Integrity and Testing Hallucinations</h1>
</center>

FAITH is an Azure AI based web application which is used to find hallucinations and ensure integrity among various AI models and LLMs along with confident scores, complete reasoning, detailed analytics and visualizations by comparing with external knowledge sources.
Multiple model support(gpt-4, gpt-4o, gpt-4o-mini, gpt-35-turbo-16k, etc.,), True and False negatives and positives, user friendly interface, detailed analytics, ready to use hosted platform are some of the unique selling points of our solution.
It is completely built on using Azure technologies like Azure App Service, Azure OpenAI, Bing Search API, Azure AI Evaluators, Azure Cosmos DB, Azure AI Foundry, Azure Container Registry, etc.,

<a href="https://faith-cyfzeshhbjcdefhb.eastus2-01.azurewebsites.net/" target="_blank">
  <img src="assets/www.png" height="50" width="50" alt="Website Logo" />
</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://github.com/KierthanaRS/FAITH" target="_blank">
  <img src="assets/github.png" height="50" width="50" alt="GitHub Logo" />
</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://youtu.be/uxRb-zxcohU" target="_blank">
  <img src="assets/youtube.png" height="50" width="50" alt="YouTube Logo" />
</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="/assets/faith.pdf" target="_blank">
  <img src="assets/ppt.jpeg" height="50" width="50" alt="Presentation Logo" />
</a>
<br/><br/>

**Key Features:**
- Multiple model support (e.g., GPT-4, GPT-4o, GPT-4o-mini, GPT-35-Turbo-16k, and custom LLMs).
- User-friendly interface with hosted platform access.
- User accounts for storing chat history and detailed analytics for future references and contextual queries.
- Detailed analytics for AI evaluation metrics, including hallucination percentages.
- Confusion matrix showing true/false positives and negatives.
- Integration with Azure technologies for seamless scalability and reliability.


## **Table of Contents**
1. [Working](#working)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Azure Technologies Used](#azure-technologies-used)
5. [Technologies Used](#technologies-used)
6. [Development](#development)
7. [Team Members](#team-members)


# Working

FAITH aims to be a robust framework and accessible service that identifies hallucinations in AI-generated outputs and validates them against trusted external data sources or a pre-defined knowledge base. Furthermore, it provides false positive and false negative rates for hallucination detection, with the ability to integrate and validate with multiple external knowledge sources, and provides user-friendly visualization of hallucination metrics.


# Features

- **Multi-Model Support**: Compare prominent LLMs like GPT-4, GPT-4o, and custom models.  
- **User Accounts:**: Support user account with authentication to maintain chat histories and user-specific analytics.  
- **Hallucination Analysis**: Detect hallucinations with reasoning and confidence scores for every output.  
- **Detailed Metrics**: Track performance using a confusion matrix and evaluator metrics like bias and violence detection.  
- **External Validation**: Validate results against trusted sources using Bing Search API.  


# Architecture

![Architecture Diagram](assets/architecture.png)

# Azure Technologies Used

1. **Azure App Service:**
   
   Responsible for containerized deployment of frontend (Next.js application) and backend (FastAPI server) with Docker for efficiency in an automated manner using Github Actions, by leveraging Azure Container Registry.
2. **Azure Cosmos DB:**
   
   Used for storing user information for authentication, chat history, analytics and model test results by leveraging MongoDB for efficient querying and storage of large data for easier analytics and aggregation.
3. **Azure OpenAI:**
   
   Responsible for integration of multiple Azure-hosted GPT models for robust language understanding and output generation with API keys and endpoints for easier querying.
4. **Azure AI Foundry:**
   
   Aids in orchestration of multiple LLMs for efficient processing and endpoints for several LLMs that are provided by Azure OpenAI.
5. **Azure AI Service:**
   
   Enhances the application with pre-built AI capabilities like sentiment analysis and anomaly detection.
6. **Azure Bing Search API:**
   
   Serves as the primary source of extraction of information from external knowledge sources for validation of AI-generated content, which is used for verification of hallucination with and without context.
7. **Azure Container Registry:**
   
   Streamlines the deployment process by managing Docker containers for both the frontend and backend using continuous deployment for faster development to production environment.
8. **Azure SDK for Python:**
   
   Used for authentication to Azure services from backend and usage of AI Evaluator, that is responsible for detection of bias, violence, or other issues in AI outputs by using Azure OpenAI.
9. **Azure Cognitive Services:**
   
   Powers natural language understanding and computer vision features for enhanced analytics.


# Technologies Used

1. **Next.js**:

   Powers the frontend for a dynamic and responsive web application, by leveraging TailwindCSS for responsive design along with `react-chartjs` which is responsible for providing interactive and informative data visualizations of analytics.

2. **Python**:
   
   Serves as the backend's backbone for its simplicity and robust ecosystem, which allows
   seamless integration with libraries such as LangChain and Azure SDK for Python.

3. **FastAPI**:

   Enables rapid development of performant, asynchronous RESTful APIs with strong typing with Pydantic. Responsible for user authentication and integration with rest of Azure services along with the frontend

4. **MongoDB**:

   A NoSQL database for flexible and scalable data storage of user information, chat history and analytics, that is leveraged by Azure CosmosDB, using the `motor` library, which allows asynchronous processing, providing concurrency and better performance.

5. **GitHub**:
   
   Version control and collaboration for seamless development, with GitHub Actions that allows continuous deployment of frontend and backend to the production by leveraging Azure CLI and Docker.

6. **Docker**:

   Facilitates containerized application development and deployment for conflict-free and good developer experience. It is paired with Docker compose for multi-container orchestration, useful for local development

7. **LangChain**:

   Enhances the orchestration of multiple LLMs, that is used for response generation for the prompts given by the end-user, with or without context


# Development

FAITH is structured as a **monorepo**, organized as follows:

- **Frontend:** Built using Next.js for a dynamic and user-friendly web interface.
- **Backend:** RESTful APIs developed with Python and FastAPI.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose for containerized development

## Steps to Run Locally

1. Verify Docker and Docker Compose are installed:
   ```shell
   docker -v
   docker compose version
   ```
2. Clone the repository and set up environment variables as per the `.env.sample` for the frontend and backend.
   ```shell
   git clone https://github.com/KierthanaRS/FAITH
   cd FAITH
   touch frontend/.env
   touch backend/.env
   ```
3. Build and start the services:
   ```shell
   docker compose --env-file frontend/.env --env-file backend/.env up --build
   ```

For more information regarding local development, check out the README for [frontend](/frontend/README.md) and [backend](/backend/README.md)


# Team Members

1. **Aruthra S**  
   - [GitHub](https://github.com/AruthraS)  
   - [LinkedIn](https://www.linkedin.com/in/aruthra-s-66b97b256/)  

2. **R S Kierthana**  
   - [GitHub](https://github.com/KierthanaRS)  
   - [LinkedIn](https://www.linkedin.com/in/kierthana-rajesh-8b8b42256/)  

3. **Arun Pranav A T**  
   - [GitHub](https://github.com/arunpranav-at)  
   - [LinkedIn](https://www.linkedin.com/in/arunpranavat/)  
