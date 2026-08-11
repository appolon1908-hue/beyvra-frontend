FROM node:22-bookworm-slim
WORKDIR /app
COPY --chown=node:node package*.json /app/
RUN npm ci
COPY --chown=node:node . .
USER node
EXPOSE 8080
CMD [ "npm", "run", "dev" ]
