# 🚀 Test Deploy App

Простое веб-приложение для тестирования деплоя с аутентификацией, nginx, SSL и Docker.

## 🎯 Что это

- **Frontend**: Next.js приложение с формой логина
- **Backend**: Express.js API с аутентификацией
- **Infrastructure**: Nginx reverse proxy + SSL
- **Deployment**: Docker Compose для dev и production

## 🧪 Быстрый старт

### Локальная разработка
```bash
# Клонируйте репозиторий
git clone <your-repo-url>
cd test-deploy

# Запустите в режиме разработки
docker-compose up --build

# Откройте http://localhost:4000
# Тестовые данные: admin / qwerty123
```

### Production тестирование
```bash
# Запустите с nginx (локально)
docker-compose -f docker-compose.prod.yml up --build

# Откройте https://localhost (с самоподписанным сертификатом)
```

## 🌐 Деплой на сервер

### 1. Подготовка сервера
```bash
# Подключитесь к серверу
ssh user@your-server-ip

# Установите Docker
sudo apt update && sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER && newgrp docker
```

### 2. Загрузка проекта
```bash
# Через Git
git clone <your-repo-url> && cd test-deploy

# Или через SCP
scp -r ./test-deploy user@your-server:/opt/ && cd /opt/test-deploy
```

### 3. Запуск
```bash
# Без домена (только IP)
docker-compose -f docker-compose.prod.yml up -d --build

# С доменом и SSL
./scripts/setup-ssl.sh justcreatedsite.ru
# Затем раскомментируйте ssl volumes в docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📁 Структура проекта

```
test-deploy/
├── backend/                 # Express.js API
│   ├── src/server.js       # Основной сервер
│   └── Dockerfile
├── frontend/               # Next.js приложение
│   ├── src/app/           # Страницы и компоненты
│   └── Dockerfile
├── nginx/                 # Nginx конфигурация
│   ├── nginx.conf         # Основная конфигурация
│   └── Dockerfile
├── scripts/               # Скрипты для деплоя
│   ├── setup-ssl.sh       # Настройка SSL
│   └── renew-ssl.sh       # Обновление SSL
├── docker-compose.yml     # Для разработки
├── docker-compose.prod.yml # Для production
└── DEPLOYMENT_GUIDE.md    # Подробное руководство
```

## 🔐 Тестовые данные

- **Логин**: admin
- **Пароль**: qwerty123

## 🛠️ API Endpoints

- `GET /api/health` - Проверка работы сервера
- `POST /api/login` - Аутентификация

## 📚 Документация

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Подробное руководство по деплою
- [env.production.example](./env.production.example) - Пример переменных окружения

## 🎉 Готово!

После деплоя ваше приложение будет доступно по адресу:
- **С доменом**: https://justcreatedsite.ru
- **Без домена**: https://your-server-ip

Все запросы автоматически перенаправляются на HTTPS!
