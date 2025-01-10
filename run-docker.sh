#!/bin/bash

# Variables
IMAGE_NAME="budget-app"
CONTAINER_NAME="budget-app-container"
DEFAULT_PORT=5000
ENV_FILE="./backend/.env"
TERMINAL_MODE=false

# Find the next available port
get_available_port() {
  local port=$DEFAULT_PORT
  while lsof -i:$port >/dev/null 2>&1; do
    port=$((port + 1))
  done
  echo $port
}

# Parse command-line arguments
for arg in "$@"; do
  case $arg in
    --t)
      TERMINAL_MODE=true
      shift
      ;;
  esac
done

# Step 1: Stop and Remove Any Existing Container
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
  echo "Stopping and removing existing container..."
  docker stop $CONTAINER_NAME
  docker rm $CONTAINER_NAME
elif [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
  echo "Removing stopped container..."
  docker rm $CONTAINER_NAME
fi

# Step 2: Build the Docker Image
echo "Building Docker image..."
docker build -t $IMAGE_NAME .

# Step 3: Determine Available Port
HOST_PORT=$(get_available_port)
echo "Using host port: $HOST_PORT"

# Step 4: Run the Docker Container
if [ "$TERMINAL_MODE" = true ]; then
  echo "Starting Docker container in terminal (foreground) mode..."
  docker run --env-file $ENV_FILE -p $HOST_PORT:$DEFAULT_PORT \
    --name $CONTAINER_NAME $IMAGE_NAME
else
  echo "Starting Docker container in detached (background) mode..."
  docker run -d --env-file $ENV_FILE -p $HOST_PORT:$DEFAULT_PORT \
    --name $CONTAINER_NAME $IMAGE_NAME

  if [ $? -eq 0 ]; then
    echo "Docker container started successfully at http://localhost:$HOST_PORT"
  else
    echo "Failed to start the Docker container. Check the logs for details."
  fi
fi
