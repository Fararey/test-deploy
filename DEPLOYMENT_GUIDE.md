# 🚀 Руководство по деплою Test Deploy App

## ✅ Что готово

Ваше приложение полностью готово к деплою! Я создал:

### Backend (Express.js)
- ✅ Простой сервер с POST `/api/login` endpoint
- ✅ Аутентификация: `admin` / `qwerty123`
- ✅ Health check endpoint `/api/health`
- ✅ CORS настроен для фронтенда
- ✅ Docker контейнер готов

### Frontend (Next.js)
- ✅ Красивая форма логина с современным дизайном
- ✅ Обработка успешных и неуспешных ответов
- ✅ Показ тестовых учетных данных
- ✅ Docker контейнер готов

### Docker
- ✅ Docker Compose для разработки
- ✅ Docker Compose для продакшена
- ✅ Все порты настроены правильно

## 🧪 Локальное тестирование

```bash
# Запуск приложения
docker-compose up --build

# Проверка работы
# Frontend: http://localhost:4000
# Backend: http://localhost:3500/api/health
```

## 🌐 Деплой на удаленный сервер

### Шаг 1: Подготовка сервера

```bash
# Подключитесь к вашему серверу
ssh user@your-server-ip

# Установите Docker и Docker Compose
sudo apt update
sudo apt install docker.io docker-compose -y

# Добавьте пользователя в группу docker
sudo usermod -aG docker $USER
# Перелогиньтесь или выполните:
newgrp docker
```

### Шаг 2: Загрузка проекта

```bash
# Вариант 1: Через Git (если у вас есть репозиторий)
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Вариант 2: Через SCP (загрузка файлов)
# На вашем локальном компьютере:
scp -r /Users/aleksandrkonoplev/projectx/test-deploy user@your-server:/opt/
# На сервере:
cd /opt/test-deploy
```

### Шаг 3: Запуск в продакшене

```bash
# Запуск с продакшен конфигурацией
docker-compose -f docker-compose.prod.yml up -d --build

# Проверка статуса
docker-compose -f docker-compose.prod.yml ps

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f
```

### Шаг 4: Проверка работы

```bash
# Проверка бэкенда
curl http://your-server-ip:3500/api/health

# Проверка фронтенда
curl http://your-server-ip:80
```

## 🔧 Настройка домена (опционально)

Если у вас есть домен, настройте Nginx:

```bash
# Установка Nginx
sudo apt install nginx -y

# Создание конфигурации
sudo nano /etc/nginx/sites-available/test-deploy
```

Содержимое файла:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api {
        proxy_pass http://localhost:3500;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Активация сайта
sudo ln -s /etc/nginx/sites-available/test-deploy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🛡️ Безопасность (для продакшена)

### 1. Настройка файрвола

```bash
# Установка UFW
sudo apt install ufw -y

# Базовые правила
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. SSL сертификат (Let's Encrypt)

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx -y

# Получение сертификата
sudo certbot --nginx -d your-domain.com
```

## 📊 Мониторинг

### Просмотр логов

```bash
# Логи всех сервисов
docker-compose -f docker-compose.prod.yml logs

# Логи конкретного сервиса
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend

# Следить за логами в реальном времени
docker-compose -f docker-compose.prod.yml logs -f
```

### Перезапуск сервисов

```bash
# Перезапуск всех сервисов
docker-compose -f docker-compose.prod.yml restart

# Перезапуск конкретного сервиса
docker-compose -f docker-compose.prod.yml restart backend
```

## 🔄 Обновление приложения

```bash
# Остановка сервисов
docker-compose -f docker-compose.prod.yml down

# Обновление кода (если через Git)
git pull

# Пересборка и запуск
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🧹 Очистка

```bash
# Остановка и удаление контейнеров
docker-compose -f docker-compose.prod.yml down -v

# Очистка неиспользуемых образов
docker system prune -a

# Удаление всех контейнеров и образов
docker system prune -a --volumes
```

## 🎯 Итоговые команды для быстрого деплоя

```bash
# 1. Подключение к серверу
ssh user@your-server-ip

# 2. Установка Docker
sudo apt update && sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER && newgrp docker

# 3. Загрузка проекта (выберите один способ)
# Через Git:
git clone https://github.com/your-username/your-repo.git && cd your-repo
# Или через SCP:
# scp -r ./test-deploy user@your-server:/opt/ && cd /opt/test-deploy

# 4. Запуск
docker-compose -f docker-compose.prod.yml up -d --build

# 5. Проверка
curl http://your-server-ip/api/health
```

## 🎉 Готово!

Ваше приложение готово к деплою. После выполнения всех шагов:

- **Frontend**: http://your-server-ip (или ваш домен)
- **Backend API**: http://your-server-ip:3500/api
- **Тестовые данные**: admin / qwerty123

Удачи с деплоем! 🚀
