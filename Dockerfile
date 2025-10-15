FROM node:alpine 

WORKDIR /usr/src/app 

COPY package*.json  ./

# RUN npm ci --omit=dev

COPY . .

EXPOSE 8754

# CMD [ "node", "server.js" ]
# CORRECT
# CMD ["bash", "./db_wait.sh", "db", "node", "server.js"]

# Copy wait-for-db script
COPY db_wait.sh ./

# Make it executable
RUN chmod +x db_wait.sh

ENTRYPOINT ["./db_wait.sh"]
CMD ["db", "npm", "start"]





