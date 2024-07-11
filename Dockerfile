# Dockerfile for Vue frontend
# Step 1: Build the Vue application
FROM node:16-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the built files with http-server
FROM node:16-alpine AS production-stage
WORKDIR /app
RUN npm install -g http-server
COPY --from=build-stage /app/dist /app/dist
EXPOSE 8080
CMD ["http-server", "dist"]