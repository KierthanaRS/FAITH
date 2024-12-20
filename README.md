# FAITH : Framework for AI Integrity and Testing Hallucinations

# Table of Contents

1. [**Technologies Used**](#technologies-used)
2. [**Development**](#development)

# Technologies Used

# Development

FAITH is structured as a monorepo with the following folders:
- `frontend`: Contains Next.js application used for web interface
- `backend`: Contains RESTful API written in Python with FastAPI

We recommend usage of Docker and Docker Compose to get started with local development.

## Pre-requisites

1. [**Docker**](https://www.docker.com/) **and Docker Compose**: 


## Steps

1. Ensure you have Docker and Docker compose on your system by using the following commands:
```shell
docker -v
docker compose version
```

2. Clone the repository and set up the needed environment variables:
```shell
git clone https://github.com/KierthanaRS/FAITH
cd FAITH
touch frontend/.env
touch backend/.env
```

3. Start the services by using Docker compose in the project's root directory (i. e. where `docker-compose.yaml` is present):
```shell
docker compose --env-file frontend/.env --env-file backend/.env up --build
```
This will ensure the images are built and the services are started.
