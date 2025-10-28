# 🚀 Multi-Tenant Test Deploy App

Мультитенантная платформа для тестирования деплоя с аутентификацией, Traefik, SSL и Docker.

## 🎯 Что это

- **Frontend**: Next.js приложение с формой логина (мультитенантное)
- **Backend**: Express.js API с аутентификацией и управлением компаниями
- **MetaAdmin**: React панель для управления компаниями
- **Infrastructure**: Traefik dynamic router + SSL
- **Deployment**: Docker Compose для dev и production

## 🧪 Быстрый старт

### Локальная разработка
```bash
# Клонируйте репозиторий
git clone <your-repo-url>
cd test-deploy

# Запустите в режиме разработки
docker compose up --build

# Заполните базу данных
./scripts/fillInitDB.sh

# Откройте:
# MetaAdmin: http://localhost:3000 (admin/qwerty)
# Frontend: http://localhost:4000 (admin/qwerty123)
```

### Production тестирование
```bash
# Запустите с Traefik (локально)
docker compose -f docker-compose.traefik.yml up --build

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
# С Traefik и автоматическими SSL сертификатами
docker compose -f docker-compose.traefik.yml up -d --build

# Настройте DNS записи:
# meta.justcreatedsite.ru -> ваш IP
# justcreatedsite.ru -> ваш IP
# api.justcreatedsite.ru -> ваш IP
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
├── metaadmin/             # React MetaAdmin панель
│   ├── src/App.js         # Основное приложение
│   └── Dockerfile
├── traefik/               # Traefik конфигурация
│   ├── traefik.yml        # Основная конфигурация
│   └── letsencrypt/       # SSL сертификаты
├── scripts/               # Скрипты для деплоя
│   ├── fillInitDB.sh      # Заполнение БД
│   ├── setup-ssl.sh       # Настройка SSL
│   └── renew-ssl.sh       # Обновление SSL
├── docker-compose.yml     # Для разработки
├── docker-compose.traefik.yml # Для production с Traefik
└── INSTRUCTION.md         # Подробная инструкция
```

## 🔐 Тестовые данные

### Frontend (компании):
- **Логин**: admin
- **Пароль**: qwerty123

### MetaAdmin:
- **Логин**: admin
- **Пароль**: qwerty

## 🛠️ API Endpoints

### Основные:
- `GET /api/health` - Проверка работы сервера
- `POST /api/login` - Аутентификация в компании
- `GET /api/company` - Информация о компании
- `GET /api/logs` - Логи компании

### MetaAdmin:
- `POST /api/meta/login` - Вход в метаадминку
- `GET /api/meta/companies` - Список компаний
- `POST /api/meta/companies` - Создание компании
- `PUT /api/meta/companies/:id` - Обновление компании
- `DELETE /api/meta/companies/:id` - Удаление компании

## 📚 Документация

- [INSTRUCTION.md](./INSTRUCTION.md) - Подробная DevOps инструкция
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Руководство по деплою
- [env.production.example](./env.production.example) - Пример переменных окружения

## 🎉 Готово!

После деплоя ваше приложение будет доступно по адресу:

### Development:
- **MetaAdmin**: http://localhost:3000
- **Frontend**: http://localhost:4000

### Production:
- **MetaAdmin**: https://meta.justcreatedsite.ru
- **Frontend**: https://justcreatedsite.ru
- **API**: https://api.justcreatedsite.ru

Все запросы автоматически перенаправляются на HTTPS!
