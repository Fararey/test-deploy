#!/bin/bash

# Скрипт для обновления SSL сертификатов
# Рекомендуется запускать через cron: 0 2 * * * /path/to/renew-ssl.sh

set -e

echo "🔄 Проверка обновления SSL сертификатов..."

# Обновляем сертификаты
sudo certbot renew --quiet

# Проверяем, нужно ли обновить сертификаты в проекте
DOMAIN=$(ls /etc/letsencrypt/live/ | head -1)

if [ -n "$DOMAIN" ]; then
    echo "📋 Обновление сертификатов для домена: $DOMAIN"
    
    # Копируем обновленные сертификаты
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
    sudo chown $USER:$USER ssl/cert.pem ssl/key.pem
    
    # Перезапускаем nginx контейнер
    echo "🔄 Перезапуск nginx контейнера..."
    docker-compose -f docker-compose.prod.yml restart nginx
    
    echo "✅ SSL сертификаты обновлены и nginx перезапущен!"
else
    echo "ℹ️  Нет доменов для обновления"
fi
