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

# Сборка приложения для production
RUN npm run build

# Открытие порта 4000
EXPOSE 4000

# Запуск приложения в production режиме
CMD [ "npm", "start" ] 