# Базовый образ
FROM node:18

# Рабочая директория в контейнере
WORKDIR /usr/src/app

# Копирование файла package.json и package-lock.json (если есть)
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Что-то там для борьбы с EACCESS
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

# Копирование остальных файлов проекта
COPY . .

# Открытие порта 4000
EXPOSE 4000

# Запуск приложения
CMD [ "npm", "run", "dev" ] 