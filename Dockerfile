FROM node:16.13.1-alpine

WORKDIR /app
COPY package.json .

COPY . .

CMD ["npm", "start"]
