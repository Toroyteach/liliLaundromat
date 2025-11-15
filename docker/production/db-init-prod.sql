CREATE DATABASE IF NOT EXISTS production_myfunus_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'myfunus_prod_user'@'%' IDENTIFIED BY 'iLbsZrT374FkSa';
GRANT ALL PRIVILEGES ON production_myfunus_db TO 'myfunus_prod_user'@'%';

FLUSH PRIVILEGES;
