FROM node:alpine 

WORKDIR /usr/src/app 

COPY package*.json  ./

# RUN npm ci --omit=dev

COPY . .

EXPOSE 8754

# CMD [ "node", "server.js" ]

CMD ["./db_wait.sh", "db", "node", "server.js"]



