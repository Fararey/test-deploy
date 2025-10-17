#!/bin/bash

# Скрипт для настройки SSL сертификатов
# Использование: ./scripts/setup-ssl.sh justcreatedsite.ru

set -e

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "❌ Ошибка: Укажите домен"
    echo "Использование: ./scripts/setup-ssl.sh justcreatedsite.ru"
    exit 1
fi

echo "🔐 Настройка SSL для домена: $DOMAIN"

# Создаем директорию для SSL сертификатов
mkdir -p ssl

# Проверяем, установлен ли certbot
if ! command -v certbot &> /dev/null; then
    echo "📦 Установка certbot..."
    sudo apt update
    sudo apt install -y certbot
fi

# Получаем SSL сертификат
echo "🔑 Получение SSL сертификата от Let's Encrypt..."
sudo certbot certonly --standalone -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Копируем сертификаты в нашу директорию
echo "📋 Копирование сертификатов..."
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/cert.pem ssl/key.pem

echo "✅ SSL сертификаты настроены!"
echo "📁 Сертификаты сохранены в: ./ssl/"
echo ""
echo "🔄 Теперь обновите docker-compose.prod.yml:"
echo "   Раскомментируйте строки с volumes для ssl"
echo ""
echo "🚀 Перезапустите приложение:"
echo "   docker-compose -f docker-compose.prod.yml down"
echo "   docker-compose -f docker-compose.prod.yml up -d --build"
