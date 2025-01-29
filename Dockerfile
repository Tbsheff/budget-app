# Stage 1: Build React Frontend
FROM node:22-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./ 
RUN npm install
COPY frontend/ ./ 
RUN npm run build

# Stage 2: Build and Serve with Node.js Backend
FROM node:22-slim
WORKDIR /app
RUN apt-get update && apt-get install -y python3 build-essential && apt-get clean
COPY backend/package*.json ./ 
RUN npm install
RUN npm install -g nodemon
COPY backend/ ./ 

# Copy built React frontend files from Stage 1
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV RUNNING_IN_DOCKER=true

# Expose the backend port
EXPOSE 5000

# Default command to start the Node.js server using nodemon for development
CMD ["nodemon", "--watch", "./backend", "index.js"]
