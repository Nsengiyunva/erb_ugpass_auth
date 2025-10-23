FROM node:18-alpine

WORKDIR /usr/src/app

# Install bash and mysql-client (for mysqladmin ping)
RUN apk add --no-cache bash mysql-client

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8754

CMD ["npm", "start"]