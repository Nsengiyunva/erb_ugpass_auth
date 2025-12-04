FROM node:alpine

WORKDIR /usr/src/app

RUN apk add --no-cache bash mysql-client

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8754

CMD ["npm", "start"]