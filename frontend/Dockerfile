# Use the official Node.js image as a base image
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /frontend

# Copy the package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Install dependencies (including production and dev dependencies)
RUN npm i --legacy-peer-deps

# Copy the entire project into the container
COPY ./ ./

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

# Build the Next.js application
RUN npm run build

# Use a smaller image for production (we're using an official Node.js image)
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /frontend

# Copy only the necessary files from the build stage
COPY --from=builder /frontend ./

# Install only the production dependencies
RUN npm install --legacy-peer-deps

# Expose the port that the app will run on
EXPOSE 3000

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

# Start the application in production mode
CMD ["npm", "run", "start"]
