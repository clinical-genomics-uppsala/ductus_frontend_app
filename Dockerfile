ARG BASE_URL=http://127.0.0.1
ARG VUE_APP_API_ADDRESS=http://127.0.0.1
ARG VERSION=latest

FROM node:16-alpine AS build-stage

ARG BASE_URL
ARG VUE_APP_API_ADDRESS
ARG VERSION

ENV BASE_URL=${BASE_URL}
ENV VUE_APP_API_ADDRESS=${VUE_APP_API_ADDRESS}
ENV VERSION=${VERSION}

RUN apk add --no-cache git

RUN git clone --branch ${VERSION} https://github.com/clinical-genomics-uppsala/ductus_frontend_app.git /app

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