#!/bin/sh
set -e

# Initialize storage directory if empty
# -----------------------------------------------------------
# If the storage directory is empty, copy the initial contents
# and set the correct permissions.
# -----------------------------------------------------------
if [ ! "$(ls -A /var/www/storage)" ]; then
  echo "Initializing storage directory..."
  cp -R /var/www/storage-init/. /var/www/storage
  chown -R www-data:www-data /var/www/storage
fi

# Remove storage-init directory
rm -rf /var/www/storage-init

# Check if migrations have already been run
# -----------------------------------------------------------
# We use a simple check: look for the 'migrations' table and ensure it’s not empty.
echo "Running migration"
php artisan migrate --force

# Optimize application performance
# -----------------------------------------------------------
echo "Optimizing Laravel configuration..."
php artisan config:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
echo "✅ Laravel optimized."

# Run the default command (php-fpm)
exec "$@"