FROM node:18.18.0
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "run", "dev" ]