FROM node:22-bookworm-slim
WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY . .
EXPOSE 8080
CMD [ "npm", "run", "dev" ]
