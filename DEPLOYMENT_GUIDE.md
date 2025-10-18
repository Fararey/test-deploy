# 🚀 Руководство по деплою Test Deploy App

## ✅ Что готово

Ваше приложение полностью готово к production деплою! Я создал:

### Backend (Express.js)
- ✅ Простой сервер с POST `/api/login` endpoint
- ✅ Аутентификация: `admin` / `qwerty123`
- ✅ Health check endpoint `/api/health`
- ✅ CORS настроен для фронтенда
- ✅ PostgreSQL база данных с Sequelize ORM
- ✅ Логирование попыток входа в БД
- ✅ Endpoint `/api/logs` для получения истории
- ✅ Docker контейнер готов

### Frontend (Next.js)
- ✅ Красивая форма логина с современным дизайном
- ✅ Обработка успешных и неуспешных ответов
- ✅ Показ тестовых учетных данных
- ✅ Отображение истории попыток входа
- ✅ Автоматическое обновление логов
- ✅ Docker контейнер готов

### Nginx (Reverse Proxy)
- ✅ Настроен как reverse proxy
- ✅ SSL/TLS поддержка
- ✅ Автоматический редирект HTTP → HTTPS
- ✅ Gzip сжатие
- ✅ Security headers
- ✅ Статические файлы кеширование

### Docker & Infrastructure
- ✅ Docker Compose для разработки
- ✅ Docker Compose для продакшена с nginx
- ✅ PostgreSQL база данных в продакшене
- ✅ SSL сертификаты (Let's Encrypt)
- ✅ Автоматическое обновление сертификатов
- ✅ Логирование nginx
- ✅ Персистентное хранение данных БД

## 🧪 Локальное тестирование

### Разработка (без nginx)
```bash
# Запуск приложения для разработки
docker-compose up --build

# Проверка работы
# Frontend: http://localhost:4000
# Backend: http://localhost:3500/api/health
# Logs: http://localhost:3500/api/logs
```

### Production тестирование (с nginx)
```bash
# Запуск с nginx для тестирования production конфигурации
docker-compose -f docker-compose.prod.yml up --build

# Проверка работы
# Frontend + Backend через nginx: https://localhost (с самоподписанным сертификатом)
# Или: http://localhost (редирект на HTTPS)
# Logs API: https://localhost/api/logs
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

# Проверка логов
curl http://your-server-ip:3500/api/logs

# Проверка фронтенда
curl http://your-server-ip:80
```

## 🌐 Настройка домена и SSL

### Шаг 1: Покупка домена

Вам нужно купить домен у любого регистратора:
- **Российские**: REG.RU, 2domains, Beget
- **Международные**: Namecheap, GoDaddy, Cloudflare
- **Цена**: от 100-500₽/год

### Шаг 2: Настройка DNS

В панели управления доменом настройте A-запись:
```
Тип: A
Имя: @ (или оставьте пустым)
Значение: IP_АДРЕС_ВАШЕГО_СЕРВЕРА
TTL: 3600 (или по умолчанию)
```

### Шаг 3: Получение SSL сертификата

```bash
# На вашем сервере выполните:
./scripts/setup-ssl.sh justcreatedsite.ru

# Это автоматически:
# 1. Получит SSL сертификат от Let's Encrypt
# 2. Скопирует сертификаты в папку ssl/
# 3. Покажет инструкции по обновлению docker-compose
```

### Шаг 4: Обновление конфигурации

После получения SSL сертификата:

1. **Раскомментируйте строки в docker-compose.prod.yml:**
```yaml
volumes:
  - ./ssl:/etc/nginx/ssl:ro  # Раскомментируйте эту строку
```

2. **Перезапустите приложение:**
```bash
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up --build
```

### Шаг 5: Автоматическое обновление SSL

Добавьте в crontab для автоматического обновления сертификатов:
```bash
# Откройте crontab
crontab -e

# Добавьте строку для обновления каждый день в 2:00
0 2 * * * /path/to/your/project/scripts/renew-ssl.sh
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
sudo certbot --nginx -d justcreatedsite.ru
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

### Без домена (только IP)
```bash
# 1. Подключение к серверу
ssh user@your-server-ip

# 2. Установка Docker
sudo apt update && sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER && newgrp docker

# 3. Загрузка проекта
git clone https://github.com/your-username/your-repo.git && cd your-repo
# Или: scp -r ./test-deploy user@your-server:/opt/ && cd /opt/test-deploy

# 4. Запуск
docker-compose -f docker-compose.prod.yml up -d --build

# 5. Проверка
curl https://your-server-ip/api/health
```

### С доменом и SSL
```bash
# 1-3. Те же шаги что выше

# 4. Настройка SSL
./scripts/setup-ssl.sh justcreatedsite.ru

# 5. Обновление docker-compose.prod.yml (раскомментировать ssl volumes)

# 6. Перезапуск с SSL
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# 7. Проверка
curl https://justcreatedsite.ru/api/health
```

## 💰 Что нужно купить

### Обязательно:
1. **VPS/Сервер** - от 300-1000₽/месяц
   - DigitalOcean, Vultr, Timeweb, Beget
   - Минимум: 1GB RAM, 1 CPU, 25GB SSD

2. **Домен** - от 100-500₽/год (опционально)
   - REG.RU, 2domains, Namecheap
   - Можно использовать IP без домена

### Не нужно покупать:
- ❌ SSL сертификат (Let's Encrypt бесплатный)
- ❌ CDN (для простого проекта не нужен)
- ❌ База данных (используем встроенную аутентификацию)

## 🎉 Готово!

Ваше приложение готово к деплою. После выполнения всех шагов:

- **Frontend**: http://your-server-ip (или ваш домен)
- **Backend API**: http://your-server-ip:3500/api
- **Logs API**: http://your-server-ip:3500/api/logs
- **Тестовые данные**: admin / qwerty123
- **База данных**: PostgreSQL с персистентным хранением

Удачи с деплоем! 🚀
