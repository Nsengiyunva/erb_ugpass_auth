FROM node:18-alpine

WORKDIR /usr/src/app

# Install bash and mysql-client (for mysqladmin ping)
RUN apk add --no-cache bash mysql-client

COPY package*.json ./
RUN npm install

COPY . .

# Copy wait-for-db script
COPY db_wait.sh ./

# Make it executable
RUN chmod +x db_wait.sh

EXPOSE 8754

# Run script via bash
CMD ["bash", "./db_wait.sh", "db", "npm", "start"]