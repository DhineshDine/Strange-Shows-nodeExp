FROM node:20-apline
WORKDIR /app
COPY Package*.json ./
RUN npm install
COPY . .
Expose 3000
CMD ["node", "server.js"]