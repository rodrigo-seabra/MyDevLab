FROM composer:2 AS composer

FROM php:8.4-apache-bookworm

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

COPY --from=composer /usr/bin/composer /usr/local/bin/composer

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq-dev \
        git \
        unzip \
    && docker-php-ext-install -j"$(nproc)" pdo_pgsql \
    && a2enmod rewrite \
    && sed -ri \
        -e "s!/var/www/html!${APACHE_DOCUMENT_ROOT}!g" \
        /etc/apache2/sites-available/*.conf \
    && apt-mark manual libpq5 \
    && apt-get purge -y --auto-remove libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html