# FAITH Frontend

# Table of Contents

# Technologies

# Development

The frontend of FAITH uses Next.js for building an interactive user interface. It is advisable to use Docker for working with the frontend instead of using the development server to ensure a successful deployment as Docker build uses `next build` than `next dev` which is responsible for linting and type-checking.

## Pre-requisites

1. [**Node.js:**](https://nodejs.org/) JavaScript runtime and package management for frontend. Installing Node.js automatically installs `npm`, required for package management.
2. [**Docker:**](https://www.docker.com/) (optional) Supports containerization of frontend for easier deployment.

## Steps

### Manual

1. Ensure you have Node.js and Docker (optional) on your system:

```shell
node -v
npm -v
docker -v
```

2. Install the needed dependencies for the project after cloning the project by the following command:

```shell
git clone https://github.com/KierthanaRS/FAITH
cd FAITH/frontend
npm i --legacy-peer-deps
```

3. Configure the needed environment variables as per `.env.sample` file

4. Using the development server is acceptable for faster iterations during local development. Start the development server with the following command:

```bash
npm run dev
```

The frontend should be accessible at [https://localhost:3000](https://localhost:3000)

5. Build for production and test it using the following command:

```bash
npm run build
npm run start
```

### Docker

1. Build a Docker image with the following command after configuring the necessary environment variables (assuming you're using `FAITH/frontend` as the working directory):

```shell
docker build --build-arg NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL -t faith-frontend:latest .
```

2. Run the image with the following command:
```shell
docker run --network host faith-frontend:latest 
```

The frontend should be accessible at [http://localhost:3000](http://localhost:3000)