FROM node:alpine

LABEL version="1.0"
LABEL description="Authentication Service for UgPass"

WORKDIR /usr/app 

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

CMD [ "node", "server.js" ]
