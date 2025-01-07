#!/bin/bash

# Variables
CONTAINER_NAME="budget-app-container"
REMOVE_CONTAINER=false

# Parse command-line arguments
for arg in "$@"; do
  case $arg in
    --remove)
      REMOVE_CONTAINER=true
      shift
      ;;
  esac
done

# Check if the container is running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
  echo "Stopping Docker container: $CONTAINER_NAME..."
  docker stop $CONTAINER_NAME

  # Remove the container if the flag is set
  if [ "$REMOVE_CONTAINER" = true ]; then
    echo "Removing Docker container: $CONTAINER_NAME..."
    docker rm $CONTAINER_NAME
  fi

  echo "Docker container stopped successfully."
else
  echo "No running container found with the name: $CONTAINER_NAME."
fi
