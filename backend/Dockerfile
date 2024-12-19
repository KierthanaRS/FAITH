# Stage 1: Build stage
FROM python:3.12-slim AS builder

# Set the working directory inside the container
WORKDIR /backend

# Copy the requirements.txt file into the container
COPY requirements.txt .

RUN python3 -m venv /opt/venv

# Install build dependencies and necessary packages
RUN /opt/venv/bin/pip install --no-cache-dir --upgrade pip && \
    /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# Stage 2: Production stage
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /backend

# Copy only the installed dependencies from the builder stage
COPY --from=builder /opt/venv /opt/venv
COPY ./ ./

# Expose the port that the FastAPI app will run on
EXPOSE 8000

# Command to run the FastAPI app with uvicorn (use --host 0.0.0.0 to allow external access)
CMD ["/opt/venv/bin/gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "server:app"]