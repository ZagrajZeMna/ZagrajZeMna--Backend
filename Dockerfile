FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chown -R node:node /app

EXPOSE 4000

CMD ["node", "server.js", "&", "node", "swagger"]