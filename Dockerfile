# Base image
FROM php:8.3-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    locales \
    zip \
    unzip \
    git \
    curl \
    nodejs \
    npm \
    vim \
    nano \
    less \
    libicu-dev \
    chromium \
    libx11-xcb1 \
    libxcomposite1 \
    libasound2t64 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libxcb1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install -j$(nproc) gd pdo pdo_mysql intl exif sockets ftp

ENV CHROME_PATH=/usr/bin/chromium

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . .

# Install Laravel dependencies
RUN composer install --optimize-autoloader

# Install npm dependencies
RUN npm install --force && npm run build

# Set permissions
RUN chown -R www-data:www-data /var/www/ \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Always allow large uploads
RUN echo "upload_max_filesize=100M\npost_max_size=100M\nmemory_limit=256M" > /usr/local/etc/php/conf.d/uploads.ini

# # Expose port
EXPOSE 8099

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY queue-entrypoint.sh /usr/local/bin/queue-entrypoint.sh
RUN chmod +x /usr/local/bin/queue-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]