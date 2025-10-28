FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Build для production
RUN npm run build

# Устанавливаем serve для статических файлов
RUN npm install -g serve

EXPOSE 3000

# Запускаем production build
CMD ["serve", "-s", "build", "-l", "3000"]
