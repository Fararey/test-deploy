# 🚀 Test Deploy App

Простое приложение для тестирования деплоя с аутентификацией.

## 📋 Описание

- **Backend**: Express.js сервер с простой аутентификацией
- **Frontend**: Next.js приложение с красивой формой логина
- **Docker**: Готовые контейнеры для деплоя

## 🔐 Тестовые учетные данные

- **Имя**: `admin`
- **Пароль**: `qwerty123`

## 🛠 Локальная разработка

### Запуск через Docker Compose

```bash
# Запуск всех сервисов
docker-compose up --build

# Запуск в фоновом режиме
docker-compose up -d --build
```

### Доступ к приложению

- **Frontend**: http://localhost:4000
- **Backend API**: http://localhost:3500/api
- **Health Check**: http://localhost:3500/api/health

### Остановка

```bash
docker-compose down
```

## 🌐 Деплой на удаленный сервер

### 1. Подготовка сервера

```bash
# Установка Docker и Docker Compose
sudo apt update
sudo apt install docker.io docker-compose -y

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER
# Перелогиниться или выполнить:
newgrp docker
```

### 2. Загрузка проекта на сервер

```bash
# Клонирование или загрузка файлов на сервер
git clone <your-repo> /opt/test-deploy
cd /opt/test-deploy

# Или загрузка через scp
scp -r ./test-deploy user@your-server:/opt/
```

### 3. Настройка для продакшена

Создайте файл `docker-compose.prod.yml`:

```yaml
version: '3.9'
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:4000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_BACKEND_URL=http://your-domain.com/api
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3500:3500"
    environment:
      - NODE_ENV=production
      - PORT=3500
    restart: unless-stopped
```

### 4. Запуск в продакшене

```bash
# Запуск с продакшен конфигом
docker-compose -f docker-compose.prod.yml up -d --build

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f

# Проверка статуса
docker-compose -f docker-compose.prod.yml ps
```

### 5. Настройка домена (опционально)

Если у вас есть домен, настройте Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3500;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔧 Полезные команды

```bash
# Пересборка контейнеров
docker-compose build --no-cache

# Просмотр логов
docker-compose logs -f [service-name]

# Остановка и удаление контейнеров
docker-compose down -v

# Очистка Docker
docker system prune -a
```

## 📁 Структура проекта

```
test-deploy/
├── backend/
│   ├── src/
│   │   └── server.js          # Express сервер
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx           # Главная страница
│   │   ├── layout.tsx         # Layout
│   │   └── globals.css        # Стили
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml         # Docker Compose конфиг
└── README.md
```

## 🐛 Отладка

### Проверка работы бэкенда

```bash
curl -X POST http://localhost:3500/api/login \
  -H "Content-Type: application/json" \
  -d '{"name":"admin","password":"qwerty123"}'
```

### Проверка логов

```bash
# Логи всех сервисов
docker-compose logs

# Логи конкретного сервиса
docker-compose logs backend
docker-compose logs frontend
```

## 🚀 Готово к деплою!

Ваше приложение готово к деплою. Просто следуйте инструкциям выше для развертывания на удаленном сервере.
