FROM nginx:alpine

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Создаем директории для SSL сертификатов
RUN mkdir -p /etc/nginx/ssl

# Создаем самоподписанный сертификат для разработки
RUN apk add --no-cache openssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/key.pem \
    -out /etc/nginx/ssl/cert.pem \
    -subj "/C=RU/ST=Moscow/L=Moscow/O=TestDeploy/OU=IT/CN=localhost"

# Открываем порты
EXPOSE 80 443

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
