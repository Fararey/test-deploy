FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g nodemon
RUN npm install

COPY . .

EXPOSE 3500

CMD [ "nodemon", "./src/server.js" ]
