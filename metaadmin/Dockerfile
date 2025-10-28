# Базовый образ
FROM node:18-alpine

# Рабочая директория в контейнере
WORKDIR /usr/src/app

# Копирование файла package.json и package-lock.json (если есть)
COPY package*.json ./

# Установка всех зависимостей
RUN npm ci

# Копирование остальных файлов проекта
COPY . .

# Открытие порта 3000
EXPOSE 3000

# Запуск приложения в зависимости от NODE_ENV
# Запуск приложения в зависимости от NODE_ENV
CMD if [ "$NODE_ENV" = "production" ]; then npm run build && npm start; else npm run dev; fi 
