# Stage 1: Build React Frontend
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm update
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]