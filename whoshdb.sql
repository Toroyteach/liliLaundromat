-- MariaDB dump 10.17  Distrib 10.4.11-MariaDB, for osx10.10 (x86_64)
--
-- Host: localhost    Database: whoshlaundrimat_db
-- ------------------------------------------------------
-- Server version	10.4.11-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audits`
--

DROP TABLE IF EXISTS `audits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audits` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_id` int(10) unsigned DEFAULT NULL,
  `subject_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`properties`)),
  `host` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `request_method` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `headers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`headers`)),
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `query_params` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`query_params`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audits`
--

LOCK TABLES `audits` WRITE;
/*!40000 ALTER TABLE `audits` DISABLE KEYS */;
/*!40000 ALTER TABLE `audits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `branches` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `branches_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (1,'Main Branch','Evergreen Square off Kiambu Road','0116534908','2025-12-11 05:28:09','2025-12-11 05:28:09');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loyalty_points` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customers_phone_unique` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Prof. Shad Yundt MD','+1-772-805-8638','hill.ahmed@example.com','8088 Kassulke Locks Suite 052\nNew Rafael, WI 95578-6200',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(2,'Armando Hudson','1-252-935-9263','tommie40@example.com','12428 Fadel Lakes\nSouth Thadland, NM 74836',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(3,'Zackary Franecki','856-499-0018','dibbert.vernon@example.com','72581 Raynor Burg\nEast Darlene, IL 30045-2401',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(4,'Zena Boyle','801.966.2889','mkris@example.org','855 Ruth Hills Apt. 246\nYadirachester, MN 55618-6033',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(5,'Chesley Leannon','+1-907-456-2205','derick68@example.org','3243 Andreanne Lodge\nLake Tia, OK 91348-7877',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(6,'Bethel Schneider','475-890-3470','cjacobson@example.org','732 Aracely Cliff\nLake Dedric, OR 16193',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(7,'Lauriane Cartwright','1-351-724-1678','rose23@example.net','1295 Larson Summit\nHowellstad, KS 38728-3962',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(8,'Fletcher White','901-703-2761','zlowe@example.org','3449 Else Neck Apt. 884\nSouth Thalia, OK 35811-4837',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(9,'Eunice Wisoky','+1 (805) 570-7428','rebeka40@example.com','9783 Hackett Inlet Suite 054\nNew Roxanneland, AL 40621-5875',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(10,'Teagan Treutel Jr.','+1-757-385-7136','dmarks@example.org','22922 Quinten Camp\nOrnport, NC 45394',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(11,'Rhiannon Kiehn','201.718.6638','alexa.schaden@example.org','35808 Lance Vista Suite 608\nPort Shemar, ND 83079-2685',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(12,'Darby Frami','934.477.5749','johnston.delfina@example.com','421 Bechtelar Unions Suite 714\nWest Brooksshire, MO 91576-2713',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(13,'Idell Barton','(248) 649-1184','idell18@example.com','90860 Gutmann Track\nPort Dorthabury, ND 97993',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(14,'Dr. Adalberto Bosco','+1-910-471-0089','tom28@example.com','27936 Kshlerin Glens Apt. 864\nEast Claraberg, ND 24404-5900',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(15,'Markus Torphy','+1-662-304-3772','ulueilwitz@example.net','994 Helene Oval Apt. 382\nLake Kathrynshire, WY 51294-3554',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(16,'Abner Volkman DVM','+1-520-431-5363','bfay@example.org','506 Eden Corner\nSchummmouth, TN 73561-6874',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(17,'Jaqueline Daugherty','+1-573-734-6808','fschowalter@example.com','16232 Delphine Locks\nPort Bernhard, OH 00235-5656',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(18,'Ian Frami II','351.895.8059','adurgan@example.com','185 Bernier Mall\nRippinview, LA 11845',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(19,'Kitty Quitzon','+16607244221','rosalyn.baumbach@example.org','21657 Douglas Knolls\nCatharineville, OH 05926',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(20,'Dr. Mireille Shanahan PhD','1-605-577-3713','deshaun37@example.org','4322 Rylan Ways\nSouth Julius, AL 60062',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(21,'Flossie Klein','270.595.7642','heather.metz@example.org','943 Shields Cliffs Apt. 671\nInesport, CO 40352',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(22,'Dr. Emery Walker','+1-918-713-0776','kuhlman.carlos@example.org','186 Lubowitz Highway\nPort Deion, DE 33768',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(23,'Mckayla Waters','940.868.7056','makenna43@example.org','3321 Friesen Centers Suite 100\nCronabury, UT 53220',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(24,'Mrs. Lupe Leuschke IV','413.379.1627','darrick.keebler@example.net','7308 White Plaza\nMayerbury, PA 02083',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(25,'Laurie Howell','+1.551.610.3163','hgislason@example.net','938 Cullen Rue Suite 566\nHowellville, CA 84791-9723',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(26,'Zetta Carter','+1-283-479-8866','schoen.donna@example.com','121 Cristian Mews\nPort Brennanfurt, CA 40076',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(27,'Brant VonRueden','731-490-9011','yhintz@example.com','4989 Reba Row\nKrisburgh, AL 43780-9965',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(28,'Daisy Johnson','+1 (820) 845-6038','phermiston@example.net','12197 Morar Mount Suite 883\nRaquelmouth, VA 75129',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(29,'Mallory Schiller','+1-317-662-7193','nkessler@example.net','2005 Luciano Dam\nPredovicside, CT 76858',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(30,'Miss Princess Hudson','+1-915-941-5404','dbayer@example.net','90087 Luna Hills Apt. 008\nSouth Sienna, IL 27258',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(31,'Gilberto Goldner','+1-720-476-8092','cdonnelly@example.com','379 Heidenreich Ridges Suite 315\nNew Isaistad, OH 16061',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(32,'Laverne Bins','972-887-2650','melba09@example.net','20376 Amos Green Suite 746\nErnserview, AR 84182',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(33,'Shanel Gulgowski','+1 (937) 417-7065','dorcas74@example.net','83890 Gulgowski Trail\nRennerstad, NE 17531',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(34,'Mrs. Myrtis Bartoletti','239-703-7233','kara47@example.net','417 Brown Grove Apt. 193\nEast Amirland, FL 12991-5764',0,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(35,'Elyse Schoen','(360) 386-4978','gerda.veum@example.net','19047 Christelle Street Suite 321\nRhiannonland, AZ 53267-5156',0,'2025-12-11 05:28:09','2025-12-11 05:28:09');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `garmet_handling_logs`
--

DROP TABLE IF EXISTS `garmet_handling_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `garmet_handling_logs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_item_id` bigint(20) unsigned NOT NULL,
  `handled_by_user_id` bigint(20) unsigned NOT NULL,
  `stage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scanned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `garmet_handling_logs_order_item_id_foreign` (`order_item_id`),
  KEY `garmet_handling_logs_handled_by_user_id_foreign` (`handled_by_user_id`),
  KEY `garmet_handling_logs_stage_index` (`stage`),
  CONSTRAINT `garmet_handling_logs_handled_by_user_id_foreign` FOREIGN KEY (`handled_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `garmet_handling_logs_order_item_id_foreign` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `garmet_handling_logs`
--

LOCK TABLES `garmet_handling_logs` WRITE;
/*!40000 ALTER TABLE `garmet_handling_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `garmet_handling_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `garmet_types`
--

DROP TABLE IF EXISTS `garmet_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `garmet_types` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `default_pricing_mode` enum('per_piece','per_kg') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'per_piece',
  `default_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `garmet_types_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `garmet_types`
--

LOCK TABLES `garmet_types` WRITE;
/*!40000 ALTER TABLE `garmet_types` DISABLE KEYS */;
INSERT INTO `garmet_types` VALUES (1,'Blazer','per_piece',400.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(2,'Jacket /Trench Coat','per_piece',400.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(3,'Graduation Gown','per_piece',1000.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(4,'Suit (Blazer @ Trouser)','per_piece',500.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(5,'Socks','per_piece',100.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(6,'Shirt/Blouse','per_piece',150.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(7,'Official Trouser','per_piece',200.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(8,'Duvets 4*6 /Kids','per_piece',500.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(9,'Duvet 6*6/5*6','per_piece',1000.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(10,'Throw Blanket','per_piece',400.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(11,'Normal Blanket','per_piece',600.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(12,'Bedsheets /White/Coloured','per_piece',300.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(13,'Small Towel','per_piece',200.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(14,'Large Towel','per_piece',300.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(15,'Pillows','per_piece',300.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(16,'Mattress Cover','per_piece',300.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(17,'Bras /Panties/Boxers','per_piece',200.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(18,'Sheers','per_piece',200.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(19,'Curtains','per_kg',300.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(20,'Teddy Bear (Small)','per_piece',300.00,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(21,'Teddy Bear (Big)','per_piece',400.00,'2025-12-11 05:28:09','2025-12-11 05:28:09');
/*!40000 ALTER TABLE `garmet_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoices` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `customer_id` bigint(20) unsigned NOT NULL,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `sent_to_customer` tinyint(1) NOT NULL DEFAULT 0,
  `generated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoices_invoice_number_unique` (`invoice_number`),
  KEY `invoices_order_id_foreign` (`order_id`),
  KEY `invoices_customer_id_foreign` (`customer_id`),
  CONSTRAINT `invoices_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `invoices_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (1,1,6,'INV0365',300.00,0.00,200.00,300.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(2,2,7,'INV7060',300.00,0.00,200.00,300.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(3,3,8,'INV4122',300.00,0.00,200.00,300.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(4,4,9,'INV7218',300.00,0.00,200.00,300.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(5,5,10,'INV9365',300.00,0.00,200.00,300.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(6,6,11,'INV1223',300.00,0.00,200.00,300.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(7,7,12,'INV3829',300.00,0.00,200.00,300.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(8,8,13,'INV1974',300.00,0.00,200.00,300.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(9,9,14,'INV5475',300.00,0.00,200.00,300.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(10,10,15,'INV5684',300.00,0.00,200.00,300.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(11,11,24,'INV7287',1085.00,0.00,200.00,2246.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(12,12,33,'INV5806',698.00,0.00,200.00,3693.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(13,13,19,'INV5454',1165.00,0.00,200.00,3357.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(14,14,30,'INV8273',3667.00,0.00,200.00,3012.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(15,15,16,'INV0523',2362.00,0.00,200.00,3402.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(16,16,24,'INV3517',969.00,0.00,200.00,4526.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(17,17,20,'INV3475',1326.00,0.00,200.00,917.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(18,18,24,'INV4430',922.00,0.00,200.00,4939.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(19,19,18,'INV2655',3423.00,0.00,200.00,1384.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(20,20,35,'INV8240',4603.00,0.00,200.00,1672.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(21,21,16,'INV6939',359.00,0.00,200.00,545.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(22,22,33,'INV3638',650.00,0.00,200.00,3832.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(23,23,32,'INV2720',1743.00,0.00,200.00,3172.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(24,24,29,'INV5612',576.00,0.00,200.00,2556.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(25,25,22,'INV1591',814.00,0.00,200.00,839.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(26,26,35,'INV6941',2496.00,0.00,200.00,1107.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(27,27,35,'INV8089',2013.00,0.00,200.00,1140.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(28,28,16,'INV7549',4172.00,0.00,200.00,1930.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(29,29,29,'INV2749',2348.00,0.00,200.00,573.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(30,30,17,'INV7427',4463.00,0.00,200.00,1896.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(31,31,22,'INV1746',4377.00,0.00,200.00,1419.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(32,32,24,'INV9909',4236.00,0.00,200.00,2815.00,0,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(33,33,18,'INV6736',3554.00,0.00,200.00,2935.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(34,34,25,'INV1294',3529.00,0.00,200.00,2464.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(35,35,24,'INV4678',2463.00,0.00,200.00,3524.00,1,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09');
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_10_29_075428_add_two_factor_columns_to_users_table',1),(5,'2025_10_29_075503_create_personal_access_tokens_table',1),(6,'2025_10_29_075557_create_oauth_auth_codes_table',1),(7,'2025_10_29_075558_create_oauth_access_tokens_table',1),(8,'2025_10_29_075559_create_oauth_refresh_tokens_table',1),(9,'2025_10_29_075600_create_oauth_clients_table',1),(10,'2025_10_29_075601_create_oauth_device_codes_table',1),(11,'2025_11_01_122905_create_customers_table',1),(12,'2025_11_01_122915_create_branches_table',1),(13,'2025_11_01_122933_create_orders_table',1),(14,'2025_11_01_122950_create_order_items_table',1),(15,'2025_11_01_123626_create_garmet_handling_logs_table',1),(16,'2025_11_01_123649_create_payments_table',1),(17,'2025_11_01_123657_create_invoices_table',1),(18,'2025_11_01_123709_create_audits_table',1),(19,'2025_11_01_123724_create_garmet_types_table',1),(20,'2025_11_01_125024_create_settings_table',1),(21,'2025_11_01_125039_create_roles_table',1),(22,'2025_11_01_125052_create_permissions_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_access_tokens`
--

DROP TABLE IF EXISTS `oauth_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_access_tokens` (
  `id` char(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `client_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_access_tokens_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_access_tokens`
--

LOCK TABLES `oauth_access_tokens` WRITE;
/*!40000 ALTER TABLE `oauth_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_auth_codes`
--

DROP TABLE IF EXISTS `oauth_auth_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_auth_codes` (
  `id` char(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `client_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_auth_codes_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_auth_codes`
--

LOCK TABLES `oauth_auth_codes` WRITE;
/*!40000 ALTER TABLE `oauth_auth_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_auth_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_clients`
--

DROP TABLE IF EXISTS `oauth_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_clients` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redirect_uris` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `grant_types` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_clients_owner_type_owner_id_index` (`owner_type`,`owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_clients`
--

LOCK TABLES `oauth_clients` WRITE;
/*!40000 ALTER TABLE `oauth_clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_device_codes`
--

DROP TABLE IF EXISTS `oauth_device_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_device_codes` (
  `id` char(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `client_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_code` char(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `user_approved_at` datetime DEFAULT NULL,
  `last_polled_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `oauth_device_codes_user_code_unique` (`user_code`),
  KEY `oauth_device_codes_user_id_index` (`user_id`),
  KEY `oauth_device_codes_client_id_index` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_device_codes`
--

LOCK TABLES `oauth_device_codes` WRITE;
/*!40000 ALTER TABLE `oauth_device_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_device_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_refresh_tokens`
--

DROP TABLE IF EXISTS `oauth_refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_refresh_tokens` (
  `id` char(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token_id` char(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_refresh_tokens`
--

LOCK TABLES `oauth_refresh_tokens` WRITE;
/*!40000 ALTER TABLE `oauth_refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `garment_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pricing_mode` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'per_piece',
  `quantity` int(11) NOT NULL DEFAULT 1,
  `weight_kg` decimal(8,2) DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `material` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `barcode_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `barcode_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `barcode_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_status_index` (`status`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'b1216114-bb27-3001-986b-134c2aaf09c1',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(2,1,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'d44c14a2-2857-30d5-aabb-e0272557de86',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(3,2,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'01435ddb-b41f-3611-88bd-2bd23e8184be',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(4,2,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'a18e9c50-c3f7-37ec-a9ff-3eb1559e3d5f',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(5,3,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'1bc71f70-f1b0-3f2a-ad59-bd1515a114ba',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(6,3,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'8421062a-71f3-37c3-bbd4-f3431e04c855',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(7,4,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'1a35ba1e-eef5-364b-8405-202f0b5bf50f',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(8,4,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'9b5c02f8-05c6-31be-a961-eedecbd49c7f',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(9,5,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'ca162758-eb40-38e0-9fbd-aa68e263f49f',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(10,5,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'9b5e096e-5329-3646-840a-961312681b08',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(11,6,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'2dc2c59c-b1bc-3b4a-a873-f6f37ab6c3bf',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(12,6,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'f691c8e3-008a-3cc2-a480-b3e4aa2d0055',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(13,7,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'989a976b-08f8-3424-9484-2f2a83535729',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(14,7,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'4cc0b1f3-d1b8-3d25-8001-9a988af14b2b',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(15,8,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'8d344e18-dcfa-3ac0-b677-34642fbe1fa3',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(16,8,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'5908b82d-df9a-37c6-aa5c-3fc6142d759f',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(17,9,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'f14f264d-48be-35ee-831c-5c32356a1364',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(18,9,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'2c10523a-2d46-3968-a485-7ee9870ddb90',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(19,10,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'934aa782-7bef-3ea2-8240-33911dbedf6a',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(20,10,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'c3cd1c18-70d9-3fc6-8d0b-4f2702d2d9ab',NULL,NULL,'pending',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(21,11,'Shirt/Blouse','per_piece',4,NULL,150.00,450.00,NULL,NULL,'24bb4d80-facd-3a2a-9a06-7762576c5bba',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(22,11,'Shirt/Blouse','per_piece',4,NULL,150.00,450.00,NULL,NULL,'05a936ed-7dc9-3ed6-b259-6b8461e31b0f',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(23,12,'Shirt/Blouse','per_piece',3,NULL,150.00,750.00,NULL,NULL,'19fb6eaf-5c28-303f-bf30-0f7319fbfbe9',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(24,12,'Shirt/Blouse','per_piece',3,NULL,150.00,750.00,NULL,NULL,'8baf2bce-c22f-346d-b566-f1a7ac1d22da',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(25,12,'Shirt/Blouse','per_piece',3,NULL,150.00,750.00,NULL,NULL,'041278ad-e54d-381e-868b-58e546a1b6b5',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(26,13,'Shirt/Blouse','per_piece',5,NULL,150.00,150.00,NULL,NULL,'08683d9b-3f3e-37e3-a74c-25937d524f74',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(27,13,'Shirt/Blouse','per_piece',5,NULL,150.00,150.00,NULL,NULL,'0bbec256-0636-3082-bc9b-553c64225dff',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(28,14,'Shirt/Blouse','per_piece',4,NULL,150.00,750.00,NULL,NULL,'a8129780-9959-3711-a2da-30c1552d184a',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(29,14,'Shirt/Blouse','per_piece',4,NULL,150.00,750.00,NULL,NULL,'85af1dab-e340-3d77-9496-ef955c3f529b',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(30,14,'Shirt/Blouse','per_piece',4,NULL,150.00,750.00,NULL,NULL,'7288bf9f-3a82-37ae-8369-ce80134883c4',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(31,15,'Shirt/Blouse','per_piece',4,NULL,150.00,450.00,NULL,NULL,'9bfe096e-846b-30b7-ac16-10f7a5772521',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(32,15,'Shirt/Blouse','per_piece',4,NULL,150.00,450.00,NULL,NULL,'6a4e64fa-4ce1-35b9-89aa-f58bc7754648',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(33,15,'Shirt/Blouse','per_piece',4,NULL,150.00,450.00,NULL,NULL,'b4dd4ee2-3e27-30db-ab7e-4f644500ebb7',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(34,16,'Shirt/Blouse','per_piece',3,NULL,150.00,600.00,NULL,NULL,'eed15a30-4759-300e-be03-f702582b30ba',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(35,17,'Shirt/Blouse','per_piece',2,NULL,150.00,600.00,NULL,NULL,'42841691-8286-328a-8533-b3bfe2c34812',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(36,17,'Shirt/Blouse','per_piece',2,NULL,150.00,600.00,NULL,NULL,'99b0eb31-e881-3217-91d5-7c3c7acb4660',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(37,18,'Shirt/Blouse','per_piece',1,NULL,150.00,750.00,NULL,NULL,'15f60f5e-828d-35cb-9932-178b6df90be5',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(38,18,'Shirt/Blouse','per_piece',1,NULL,150.00,750.00,NULL,NULL,'100f81d6-6139-3599-8d92-03acc2c1d0c5',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(39,18,'Shirt/Blouse','per_piece',1,NULL,150.00,750.00,NULL,NULL,'11ed1083-8b43-3c01-9720-ec85b81ce487',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(40,19,'Shirt/Blouse','per_piece',3,NULL,150.00,150.00,NULL,NULL,'5537f908-6347-332a-97ba-a7d385f6c8ac',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(41,19,'Shirt/Blouse','per_piece',3,NULL,150.00,150.00,NULL,NULL,'8880c74b-11cb-3543-87ad-902728ea89d0',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(42,20,'Shirt/Blouse','per_piece',5,NULL,150.00,150.00,NULL,NULL,'0fb68cb4-9378-3d00-b312-5fe77009e3d6',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(43,20,'Shirt/Blouse','per_piece',5,NULL,150.00,150.00,NULL,NULL,'b9cc2357-e31a-3632-9ff1-93fb3c709e20',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(44,20,'Shirt/Blouse','per_piece',5,NULL,150.00,150.00,NULL,NULL,'66eb2ee3-5fcc-3b7e-9da7-8a22d49e8305',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(45,21,'Shirt/Blouse','per_piece',2,NULL,150.00,150.00,NULL,NULL,'46919f50-534a-3e97-9029-7cf471f238ff',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(46,21,'Shirt/Blouse','per_piece',2,NULL,150.00,150.00,NULL,NULL,'38d42d37-a4f3-3d9e-990a-7a5d83282728',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(47,22,'Shirt/Blouse','per_piece',2,NULL,150.00,450.00,NULL,NULL,'37aa8b15-efa7-3619-b90a-be9f061dcc61',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(48,23,'Shirt/Blouse','per_piece',1,NULL,150.00,600.00,NULL,NULL,'0e1b5d37-45f6-3c71-80f4-34e4c328fc28',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(49,24,'Shirt/Blouse','per_piece',3,NULL,150.00,450.00,NULL,NULL,'ace1065d-a623-3225-a84f-ea988aa199a9',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(50,25,'Shirt/Blouse','per_piece',4,NULL,150.00,450.00,NULL,NULL,'e6d38384-9854-3a3e-83fa-0be511c4a9f5',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(51,25,'Shirt/Blouse','per_piece',4,NULL,150.00,450.00,NULL,NULL,'a4332962-9218-3e4e-80d8-c9857722b339',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(52,26,'Shirt/Blouse','per_piece',4,NULL,150.00,750.00,NULL,NULL,'d386140b-28a7-38de-8c06-8b79d237683f',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(53,26,'Shirt/Blouse','per_piece',4,NULL,150.00,750.00,NULL,NULL,'bd002842-9868-38ef-9b58-829b3a731b02',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(54,27,'Shirt/Blouse','per_piece',5,NULL,150.00,450.00,NULL,NULL,'f0012f04-34d0-3b0d-a5f2-5b494c58cd75',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(55,27,'Shirt/Blouse','per_piece',5,NULL,150.00,450.00,NULL,NULL,'330dd6dd-1bb3-3187-a27b-967ae3d30d39',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(56,27,'Shirt/Blouse','per_piece',5,NULL,150.00,450.00,NULL,NULL,'774b4226-0111-38a1-8bdc-cab75b8dfe97',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(57,28,'Shirt/Blouse','per_piece',4,NULL,150.00,600.00,NULL,NULL,'01b61936-3770-3276-87f4-5b1828c722bd',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(58,28,'Shirt/Blouse','per_piece',4,NULL,150.00,600.00,NULL,NULL,'c635e902-fbd4-3602-a7ff-545043460955',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(59,28,'Shirt/Blouse','per_piece',4,NULL,150.00,600.00,NULL,NULL,'ba331d54-4618-3008-bf13-729e8a57982f',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(60,29,'Shirt/Blouse','per_piece',4,NULL,150.00,600.00,NULL,NULL,'6264729b-a248-32ac-81be-c1c36c2b88d9',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(61,29,'Shirt/Blouse','per_piece',4,NULL,150.00,600.00,NULL,NULL,'47e2cfa7-7c95-3349-81c8-aa9369e0850d',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(62,30,'Shirt/Blouse','per_piece',5,NULL,150.00,450.00,NULL,NULL,'7ed913d1-f008-343c-a74a-432d44386f15',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(63,30,'Shirt/Blouse','per_piece',5,NULL,150.00,450.00,NULL,NULL,'5dafdad7-f425-3c10-be17-940c44f8d270',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(64,31,'Shirt/Blouse','per_piece',3,NULL,150.00,150.00,NULL,NULL,'e35cffe1-a77e-39ed-aef5-3800c7c2dd23',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(65,31,'Shirt/Blouse','per_piece',3,NULL,150.00,150.00,NULL,NULL,'0ad32245-f174-3c21-99ca-68ae8f78e895',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(66,32,'Shirt/Blouse','per_piece',5,NULL,150.00,750.00,NULL,NULL,'280bd367-e987-35e7-ace0-50044f7646c1',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(67,32,'Shirt/Blouse','per_piece',5,NULL,150.00,750.00,NULL,NULL,'e5490b42-1b05-3cc3-ab36-e9a23fde33d3',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(68,32,'Shirt/Blouse','per_piece',5,NULL,150.00,750.00,NULL,NULL,'a067a886-d9ac-34f0-923d-fb956b8d51f4',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(69,33,'Shirt/Blouse','per_piece',4,NULL,150.00,750.00,NULL,NULL,'c9578e88-632b-3e5a-b05a-2bd9b2dd65d0',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(70,34,'Shirt/Blouse','per_piece',2,NULL,150.00,300.00,NULL,NULL,'23b2d35b-212e-303e-a207-6a502e0fe4cc',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(71,35,'Shirt/Blouse','per_piece',2,NULL,150.00,450.00,NULL,NULL,'2437cefa-121d-3d7d-af99-283bcf20aefc',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(72,35,'Shirt/Blouse','per_piece',2,NULL,150.00,450.00,NULL,NULL,'54351574-a726-3c97-814e-69416d6a482e',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(73,35,'Shirt/Blouse','per_piece',2,NULL,150.00,450.00,NULL,NULL,'801346b7-6b7f-3067-943e-248d8c093404',NULL,NULL,'done',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `branch_id` bigint(20) unsigned NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `due_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_customer_id_foreign` (`customer_id`),
  KEY `orders_user_id_foreign` (`user_id`),
  KEY `orders_branch_id_foreign` (`branch_id`),
  KEY `orders_status_index` (`status`),
  CONSTRAINT `orders_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,6,1,1,0.00,'pending','2025-12-14 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(2,7,1,1,0.00,'pending','2025-12-14 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(3,8,1,1,0.00,'pending','2025-12-14 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(4,9,1,1,0.00,'pending','2025-12-14 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(5,10,1,1,0.00,'pending','2025-12-14 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(6,11,1,1,0.00,'pending','2025-12-14 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(7,12,1,1,0.00,'pending','2025-12-14 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(8,13,1,1,0.00,'pending','2025-12-14 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(9,14,1,1,0.00,'pending','2025-12-14 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(10,15,1,1,0.00,'pending','2025-12-14 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(11,24,1,1,0.00,'in-progress','2025-12-14 05:28:09','2025-12-10 05:28:09','2025-12-11 05:28:09'),(12,33,1,1,0.00,'ready','2025-12-14 05:28:09','2025-12-10 05:28:09','2025-12-11 05:28:09'),(13,19,1,1,0.00,'in-progress','2025-12-14 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(14,30,1,1,0.00,'pending','2025-12-14 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(15,16,1,1,0.00,'in-progress','2025-12-14 05:28:09','2025-12-10 05:28:09','2025-12-11 05:28:09'),(16,24,1,1,0.00,'pending','2025-12-14 05:28:09','2025-12-04 05:28:09','2025-12-11 05:28:09'),(17,20,1,1,0.00,'ready','2025-12-14 05:28:09','2025-12-07 05:28:09','2025-12-11 05:28:09'),(18,24,1,1,0.00,'pending','2025-12-14 05:28:09','2025-12-07 05:28:09','2025-12-11 05:28:09'),(19,18,1,1,0.00,'completed','2025-12-14 05:28:09','2025-12-09 05:28:09','2025-12-11 05:28:09'),(20,35,1,1,0.00,'in-progress','2025-12-14 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(21,16,1,1,0.00,'completed','2025-12-14 05:28:09','2025-12-07 05:28:09','2025-12-11 05:28:09'),(22,33,1,1,0.00,'completed','2025-12-14 05:28:09','2025-12-05 05:28:09','2025-12-11 05:28:09'),(23,32,1,1,0.00,'in-progress','2025-12-14 05:28:09','2025-12-09 05:28:09','2025-12-11 05:28:09'),(24,29,1,1,0.00,'in-progress','2025-12-14 05:28:09','2025-12-05 05:28:09','2025-12-11 05:28:09'),(25,22,1,1,0.00,'ready','2025-12-14 05:28:09','2025-12-08 05:28:09','2025-12-11 05:28:09'),(26,35,1,1,0.00,'completed','2025-12-14 05:28:09','2025-12-07 05:28:09','2025-12-11 05:28:09'),(27,35,1,1,0.00,'ready','2025-12-14 05:28:09','2025-12-04 05:28:09','2025-12-11 05:28:09'),(28,16,1,1,0.00,'ready','2025-12-14 05:28:09','2025-12-08 05:28:09','2025-12-11 05:28:09'),(29,29,1,1,0.00,'in-progress','2025-12-14 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(30,17,1,1,0.00,'completed','2025-12-14 05:28:09','2025-12-06 05:28:09','2025-12-11 05:28:09'),(31,22,1,1,0.00,'ready','2025-12-14 05:28:09','2025-12-06 05:28:09','2025-12-11 05:28:09'),(32,24,1,1,0.00,'pending','2025-12-14 05:28:09','2025-12-05 05:28:09','2025-12-11 05:28:09'),(33,18,1,1,0.00,'completed','2025-12-14 05:28:09','2025-12-05 05:28:09','2025-12-11 05:28:09'),(34,25,1,1,0.00,'ready','2025-12-14 05:28:09','2025-12-07 05:28:09','2025-12-11 05:28:09'),(35,24,1,1,0.00,'completed','2025-12-14 05:28:09','2025-12-05 05:28:09','2025-12-11 05:28:09');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `customer_id` bigint(20) unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mpesa_reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `processed_by_user_id` bigint(20) unsigned NOT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_mpesa_reference_unique` (`mpesa_reference`),
  KEY `payments_order_id_foreign` (`order_id`),
  KEY `payments_customer_id_foreign` (`customer_id`),
  KEY `payments_processed_by_user_id_foreign` (`processed_by_user_id`),
  KEY `payments_status_index` (`status`),
  CONSTRAINT `payments_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_processed_by_user_id_foreign` FOREIGN KEY (`processed_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,6,300.00,'cash','d838b277-4c69-38c1-8d3d-a2f4a5cf42ff','paid',2,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(2,2,7,300.00,'cash','708fa342-9651-3cba-848b-5ab30f071cc7','paid',2,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(3,3,8,300.00,'cash','758e55a4-d7a7-3b51-b2a5-c6f1d44cef7e','paid',2,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(4,4,9,300.00,'cash','958d4665-c17a-3896-a8e6-cd7e55758e42','paid',2,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(5,5,10,300.00,'cash','dbf6b7bb-1d0c-3b91-bb84-5d608cde5e42','paid',2,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(6,6,11,300.00,'cash','cfd74aa0-9a52-3982-80d7-2b3ee0b05e9d','paid',2,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(7,7,12,300.00,'cash','14f43b29-4fea-3a6f-8a79-0dc6487a0447','paid',2,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(8,8,13,300.00,'cash','78ada4ec-7225-33ec-9217-e03b1dfdc309','paid',2,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(9,9,14,300.00,'cash','d00059fe-621b-3dfe-bb7f-49f7a9e5c2dd','paid',2,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(10,10,15,300.00,'cash','6f0f3407-edc8-3c44-aa70-5c45a976bf78','paid',2,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(11,11,24,4083.00,'card','16f70efe-49d4-395c-b612-8beb0d196c51','pending',2,'2025-12-09 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(12,12,33,882.00,'cash','5a894381-5f6e-3df5-8a80-bd751dbcf564','pending',2,'2025-12-07 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(13,13,19,3941.00,'card','5e5b71c7-6603-3dde-9773-4876c100f26d','success',2,'2025-12-06 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(14,14,30,4357.00,'mpesa','d2ff44fa-22eb-307e-af9c-33a017c9f5be','success',2,'2025-12-04 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(15,15,16,1690.00,'card','affc20e3-acff-3bb2-94b2-f2e28e396571','pending',2,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(16,16,24,2727.00,'mpesa','e06d9562-f092-3eed-b175-d2fe203af71c','success',2,'2025-12-04 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(17,17,20,4421.00,'mpesa','27353714-1e37-3886-a701-950ddc694ad2','pending',2,'2025-12-05 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(18,18,24,4808.00,'mpesa','19807357-76ae-31ae-9fb8-a1ddefe56bfd','success',2,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(19,19,18,1625.00,'mpesa','f4d3d23c-4361-30ba-a49f-e761c452aee3','success',2,'2025-12-10 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(20,20,35,2804.00,'cash','1538ef16-58f2-31ae-88a5-d87d16c7c135','success',2,'2025-12-05 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(21,21,16,3032.00,'mpesa','050925ea-680a-332e-a2eb-4f979c103e5c','pending',2,'2025-12-05 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(22,22,33,802.00,'invoice','5f11c5ac-e7bc-385c-a5c4-9b0d69d93eb6','success',2,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(23,23,32,611.00,'card','361a7285-0aa3-3a4b-ad2f-b8f0907594a6','pending',2,'2025-12-06 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(24,24,29,817.00,'cash','8c871cc6-761b-3eec-b829-3fc6d4c0e570','pending',2,'2025-12-08 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(25,25,22,4556.00,'invoice','7096782b-ad74-3ca0-b1ec-9e2f07820f5c','pending',2,'2025-12-09 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(26,26,35,1130.00,'cash','7bc2ab92-67c3-3a89-9648-ed0db09b0d34','success',2,'2025-12-04 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(27,27,35,3371.00,'card','33449b3c-2cec-38ef-96e0-66a62c0059cc','pending',2,'2025-12-06 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(28,28,16,1695.00,'mpesa','4e8cb8a4-7ccb-3336-9860-92ff9e81f753','pending',2,'2025-12-05 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(29,29,29,780.00,'card','edb9323a-79fa-3c0c-a546-522a6d512168','success',2,'2025-12-04 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(30,30,17,4030.00,'mpesa','2e4a85c9-82cb-3d44-874b-3baacbdeaf9f','pending',2,'2025-12-09 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(31,31,22,927.00,'invoice','867cba30-3f44-3fe3-9edd-51172722d3c8','pending',2,'2025-12-07 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(32,32,24,1993.00,'cash','33c37431-e1e7-3f3a-9f85-13de1afdb496','pending',2,'2025-12-11 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(33,33,18,2201.00,'mpesa','92d7b8c8-bbf5-3ab3-951c-efefd3b7e138','success',2,'2025-12-06 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(34,34,25,3736.00,'cash','391915ae-aa41-304a-a2bd-7431a7684d23','pending',2,'2025-12-06 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09'),(35,35,24,3057.00,'mpesa','dc55cff2-abdc-3e1d-afb0-d245178f3481','pending',2,'2025-12-05 05:28:09','2025-12-11 05:28:09','2025-12-11 05:28:09');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'users.create',NULL,NULL,NULL),(2,'users.read',NULL,NULL,NULL),(3,'users.update',NULL,NULL,NULL),(4,'users.delete',NULL,NULL,NULL),(5,'users.attach_permission',NULL,NULL,NULL),(6,'users.detach_permission',NULL,NULL,NULL),(7,'branches.create',NULL,NULL,NULL),(8,'branches.read',NULL,NULL,NULL),(9,'branches.update',NULL,NULL,NULL),(10,'branches.delete',NULL,NULL,NULL),(11,'branches.attach_permission',NULL,NULL,NULL),(12,'branches.detach_permission',NULL,NULL,NULL),(13,'customers.create',NULL,NULL,NULL),(14,'customers.read',NULL,NULL,NULL),(15,'customers.update',NULL,NULL,NULL),(16,'customers.delete',NULL,NULL,NULL),(17,'customers.attach_permission',NULL,NULL,NULL),(18,'customers.detach_permission',NULL,NULL,NULL),(19,'orders.create',NULL,NULL,NULL),(20,'orders.read',NULL,NULL,NULL),(21,'orders.update',NULL,NULL,NULL),(22,'orders.delete',NULL,NULL,NULL),(23,'orders.attach_permission',NULL,NULL,NULL),(24,'orders.detach_permission',NULL,NULL,NULL),(25,'order_items.create',NULL,NULL,NULL),(26,'order_items.read',NULL,NULL,NULL),(27,'order_items.update',NULL,NULL,NULL),(28,'order_items.delete',NULL,NULL,NULL),(29,'order_items.attach_permission',NULL,NULL,NULL),(30,'order_items.detach_permission',NULL,NULL,NULL),(31,'payments.create',NULL,NULL,NULL),(32,'payments.read',NULL,NULL,NULL),(33,'payments.update',NULL,NULL,NULL),(34,'payments.delete',NULL,NULL,NULL),(35,'payments.attach_permission',NULL,NULL,NULL),(36,'payments.detach_permission',NULL,NULL,NULL),(37,'invoices.create',NULL,NULL,NULL),(38,'invoices.read',NULL,NULL,NULL),(39,'invoices.update',NULL,NULL,NULL),(40,'invoices.delete',NULL,NULL,NULL),(41,'invoices.attach_permission',NULL,NULL,NULL),(42,'invoices.detach_permission',NULL,NULL,NULL),(43,'settings.create',NULL,NULL,NULL),(44,'settings.read',NULL,NULL,NULL),(45,'settings.update',NULL,NULL,NULL),(46,'settings.delete',NULL,NULL,NULL),(47,'settings.attach_permission',NULL,NULL,NULL),(48,'settings.detach_permission',NULL,NULL,NULL),(49,'garmet_types.create',NULL,NULL,NULL),(50,'garmet_types.read',NULL,NULL,NULL),(51,'garmet_types.update',NULL,NULL,NULL),(52,'garmet_types.delete',NULL,NULL,NULL),(53,'garmet_types.attach_permission',NULL,NULL,NULL),(54,'garmet_types.detach_permission',NULL,NULL,NULL);
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permission`
--

DROP TABLE IF EXISTS `role_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_permission` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint(20) unsigned NOT NULL,
  `permission_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_permission_role_id_permission_id_unique` (`role_id`,`permission_id`),
  KEY `role_permission_permission_id_foreign` (`permission_id`),
  CONSTRAINT `role_permission_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permission_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permission`
--

LOCK TABLES `role_permission` WRITE;
/*!40000 ALTER TABLE `role_permission` DISABLE KEYS */;
INSERT INTO `role_permission` VALUES (1,1,1,NULL,NULL),(2,1,2,NULL,NULL),(3,1,3,NULL,NULL),(4,1,4,NULL,NULL),(5,1,5,NULL,NULL),(6,1,6,NULL,NULL),(7,1,7,NULL,NULL),(8,1,8,NULL,NULL),(9,1,9,NULL,NULL),(10,1,10,NULL,NULL),(11,1,11,NULL,NULL),(12,1,12,NULL,NULL),(13,1,13,NULL,NULL),(14,1,14,NULL,NULL),(15,1,15,NULL,NULL),(16,1,16,NULL,NULL),(17,1,17,NULL,NULL),(18,1,18,NULL,NULL),(19,1,19,NULL,NULL),(20,1,20,NULL,NULL),(21,1,21,NULL,NULL),(22,1,22,NULL,NULL),(23,1,23,NULL,NULL),(24,1,24,NULL,NULL),(25,1,25,NULL,NULL),(26,1,26,NULL,NULL),(27,1,27,NULL,NULL),(28,1,28,NULL,NULL),(29,1,29,NULL,NULL),(30,1,30,NULL,NULL),(31,1,31,NULL,NULL),(32,1,32,NULL,NULL),(33,1,33,NULL,NULL),(34,1,34,NULL,NULL),(35,1,35,NULL,NULL),(36,1,36,NULL,NULL),(37,1,37,NULL,NULL),(38,1,38,NULL,NULL),(39,1,39,NULL,NULL),(40,1,40,NULL,NULL),(41,1,41,NULL,NULL),(42,1,42,NULL,NULL),(43,1,43,NULL,NULL),(44,1,44,NULL,NULL),(45,1,45,NULL,NULL),(46,1,46,NULL,NULL),(47,1,47,NULL,NULL),(48,1,48,NULL,NULL),(49,1,49,NULL,NULL),(50,1,50,NULL,NULL),(51,1,51,NULL,NULL),(52,1,52,NULL,NULL),(53,1,53,NULL,NULL),(54,1,54,NULL,NULL),(55,2,13,NULL,NULL),(56,2,14,NULL,NULL),(57,2,15,NULL,NULL),(58,2,19,NULL,NULL),(59,2,20,NULL,NULL),(60,2,21,NULL,NULL),(61,2,25,NULL,NULL),(62,2,26,NULL,NULL),(63,2,27,NULL,NULL),(64,2,31,NULL,NULL),(65,2,32,NULL,NULL),(66,2,33,NULL,NULL),(67,2,37,NULL,NULL),(68,2,38,NULL,NULL),(69,2,39,NULL,NULL),(70,3,26,NULL,NULL),(71,3,27,NULL,NULL);
/*!40000 ALTER TABLE `role_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin',NULL,NULL,NULL),(2,'cashier',NULL,NULL,NULL),(3,'staff',NULL,NULL,NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'company_name','Wosh Laundry Ltd','2025-12-11 05:28:09','2025-12-11 05:28:09'),(2,'company_phone','0116534908','2025-12-11 05:28:09','2025-12-11 05:28:09');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `permission_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_permissions_user_id_permission_id_unique` (`user_id`,`permission_id`),
  KEY `user_permissions_permission_id_foreign` (`permission_id`),
  CONSTRAINT `user_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_permissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/*!40000 ALTER TABLE `user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_role` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `role_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_role_user_id_role_id_unique` (`user_id`,`role_id`),
  KEY `user_role_role_id_foreign` (`role_id`),
  CONSTRAINT `user_role_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_role_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (1,1,1,NULL,NULL),(2,2,2,NULL,NULL);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `two_factor_secret` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `two_factor_recovery_codes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','suspended') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `profile_photo_path` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_index` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin@example.com','2025-12-11 05:28:08','$2y$12$RiM3Bi2n79ASvEx5SKXbw.UtFpO7/p.81Whq/JJfp0q5Ngpw8MdpC',NULL,NULL,NULL,'q7T0joF33J','active','admin',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09'),(2,'Cashier User','cashier@example.com','2025-12-11 05:28:09','$2y$12$K.y66l6jqY14NHt1O0xrPeeWQkwAFnXyfb/oq5yDL0/7WTY5/3A/K',NULL,NULL,NULL,'l8KS2RGzzk','active','cashier',NULL,'2025-12-11 05:28:09','2025-12-11 05:28:09');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-11 11:29:01
