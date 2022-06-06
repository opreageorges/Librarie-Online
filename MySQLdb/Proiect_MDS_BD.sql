-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: 192.168.96.1    Database: Proiect_MDS
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE USER 'departe'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'departe'@'localhost';
CREATE USER 'departe'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'departe'@'%';

CREATE SCHEMA IF NOT EXISTS `Proiect_MDS` DEFAULT CHARACTER SET utf8 ;
USE `Proiect_MDS` ;

--
-- Table structure for table `Books`
--

DROP TABLE IF EXISTS `Books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Books` (
  `BookID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(513) NOT NULL,
  `Author` varchar(513) NOT NULL,
  `Hash_id` varchar(513) NOT NULL,
  `Remote_id` varchar(513) NOT NULL,
  PRIMARY KEY (`BookID`),
  UNIQUE KEY `Hash_id_UNIQUE` (`Hash_id`),
  UNIQUE KEY `Remote_id_UNIQUE` (`Remote_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(513) NOT NULL,
  `Password` varchar(513) NOT NULL,
  `Salt` varchar(513) NOT NULL,
  `Is_Admin` tinyint NOT NULL,
  `E-mail_Address` varchar(513) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username_UNIQUE` (`Username`),
  UNIQUE KEY `E-mail_Address_UNIQUE` (`E-mail_Address`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Bought_Books`
--

DROP TABLE IF EXISTS `Bought_Books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Bought_Books` (
  `Users_UserID` int NOT NULL,
  `Books_BookID` int NOT NULL,
  PRIMARY KEY (`Users_UserID`,`Books_BookID`),
  KEY `fk_Users_has_Books_Books1_idx` (`Books_BookID`),
  KEY `fk_Users_has_Books_Users_idx` (`Users_UserID`),
  CONSTRAINT `fk_Users_has_Books_Books1` FOREIGN KEY (`Books_BookID`) REFERENCES `Books` (`BookID`),
  CONSTRAINT `fk_Users_has_Books_Users` FOREIGN KEY (`Users_UserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bought_Books`
--

LOCK TABLES `Bought_Books` WRITE;
/*!40000 ALTER TABLE `Bought_Books` DISABLE KEYS */;
/*!40000 ALTER TABLE `Bought_Books` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-29 19:40:16
