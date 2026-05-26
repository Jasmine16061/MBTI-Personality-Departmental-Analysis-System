-- MySQL dump 10.13  Distrib 9.6.0, for macos26.4 (arm64)
--
-- Host: localhost    Database: mbti_system
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '758671e4-4c3c-11f1-afa4-cc44f1e9bdf6:1-111';

--
-- Table structure for table `Course`
--

DROP TABLE IF EXISTS `Course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Course` (
  `CourseID` int NOT NULL,
  `CourseName` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`CourseID`),
  UNIQUE KEY `CourseName` (`CourseName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Course`
--

LOCK TABLES `Course` WRITE;
/*!40000 ALTER TABLE `Course` DISABLE KEYS */;
INSERT INTO `Course` VALUES (104,'Data Structures'),(101,'Introduction to Python'),(103,'Network Security'),(102,'Web Development');
/*!40000 ALTER TABLE `Course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Course_Feedback`
--

DROP TABLE IF EXISTS `Course_Feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Course_Feedback` (
  `FeedbackID` int NOT NULL AUTO_INCREMENT,
  `CourseID` int DEFAULT NULL,
  `StudentID` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Rating` int DEFAULT NULL,
  `Comments` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`FeedbackID`),
  KEY `CourseID` (`CourseID`),
  KEY `StudentID` (`StudentID`),
  CONSTRAINT `course_feedback_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `Course` (`CourseID`),
  CONSTRAINT `course_feedback_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `Student` (`StudentID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Course_Feedback`
--

LOCK TABLES `Course_Feedback` WRITE;
/*!40000 ALTER TABLE `Course_Feedback` DISABLE KEYS */;
INSERT INTO `Course_Feedback` VALUES (1,101,'D1102031',5,'Great for beginners!'),(2,102,'D1102045',4,'Very practical.'),(3,101,'D1102115',4,'Enjoyed the assignments, python basics were clear.'),(4,103,'D1102089',5,'Vulnerability scanning tools were super cool to learn!'),(5,104,'D1102144',3,'Binary trees were a bit tough to wrap my head around.'),(6,102,'D1102159',5,'Tailwind CSS config section was incredibly helpful.');
/*!40000 ALTER TABLE `Course_Feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Department`
--

DROP TABLE IF EXISTS `Department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Department` (
  `DeptID` int NOT NULL AUTO_INCREMENT,
  `DeptName` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`DeptID`),
  UNIQUE KEY `DeptName` (`DeptName`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Department`
--

LOCK TABLES `Department` WRITE;
/*!40000 ALTER TABLE `Department` DISABLE KEYS */;
INSERT INTO `Department` VALUES (1,'Computer Science'),(3,'Cybersecurity'),(2,'Information Technology'),(4,'Software Engineering');
/*!40000 ALTER TABLE `Department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MBTI_Type`
--

DROP TABLE IF EXISTS `MBTI_Type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MBTI_Type` (
  `MBTI_Code` char(4) COLLATE utf8mb4_general_ci NOT NULL,
  `Title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Description` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`MBTI_Code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MBTI_Type`
--

LOCK TABLES `MBTI_Type` WRITE;
/*!40000 ALTER TABLE `MBTI_Type` DISABLE KEYS */;
INSERT INTO `MBTI_Type` VALUES ('ENFJ','Protagonist','Charismatic leaders.'),('ENFP','Campaigner','Enthusiastic people.'),('ENTJ','Commander','Bold leaders.'),('ENTP','Debater','Smart thinkers.'),('ESFJ','Consul','Social and caring.'),('ESFP','Entertainer','Spontaneous people.'),('ESTJ','Executive','Efficient administrators.'),('ESTP','Entrepreneur','Energetic people.'),('INFJ','Advocate','Quiet and inspiring.'),('INFP','Mediator','Poetic and kind.'),('INTJ','Architect','Strategic thinkers.'),('INTP','Logician','Innovative inventors.'),('ISFJ','Defender','Dedicated protectors.'),('ISFP','Adventurer','Flexible artists.'),('ISTJ','Logistican','Practical and fact-minded.'),('ISTP','Virtuoso','Bold and practical.');
/*!40000 ALTER TABLE `MBTI_Type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Project`
--

DROP TABLE IF EXISTS `Project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Project` (
  `ProjectID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Description` text COLLATE utf8mb4_general_ci,
  `Status` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'Open',
  `CourseID` int DEFAULT NULL,
  PRIMARY KEY (`ProjectID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Project`
--

LOCK TABLES `Project` WRITE;
/*!40000 ALTER TABLE `Project` DISABLE KEYS */;
INSERT INTO `Project` VALUES (1,'AI Chatbot Development','Developing a Python-based chatbot.','Open',101),(2,'Web Portfolio System','A collaborative React project.','In Progress',102),(3,'Cybersecurity Audit','Analyzing local network vulnerabilities.','Open',103),(4,'Blockchain Identity Ledger','Researching decentralized identity verification via Solidity.','Open',104),(5,'Cloud Pentesting Automator','Developing an automated AWS/Azure environment scanner.','Open',103),(6,'E-Commerce Microservices','Refactoring a monolithic web application into Docker microservices.','In Progress',102);
/*!40000 ALTER TABLE `Project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Project_Department`
--

DROP TABLE IF EXISTS `Project_Department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Project_Department` (
  `ProjectID` int NOT NULL,
  `DeptID` int NOT NULL,
  PRIMARY KEY (`ProjectID`,`DeptID`),
  KEY `DeptID` (`DeptID`),
  CONSTRAINT `project_department_ibfk_1` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`),
  CONSTRAINT `project_department_ibfk_2` FOREIGN KEY (`DeptID`) REFERENCES `Department` (`DeptID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Project_Department`
--

LOCK TABLES `Project_Department` WRITE;
/*!40000 ALTER TABLE `Project_Department` DISABLE KEYS */;
INSERT INTO `Project_Department` VALUES (1,1),(4,1),(1,2),(2,2),(6,2),(3,3),(5,3),(4,4),(6,4);
/*!40000 ALTER TABLE `Project_Department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Project_Group`
--

DROP TABLE IF EXISTS `Project_Group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Project_Group` (
  `GroupID` int NOT NULL AUTO_INCREMENT,
  `ProjectID` int NOT NULL,
  `GroupName` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`GroupID`),
  KEY `ProjectID` (`ProjectID`),
  CONSTRAINT `project_group_ibfk_1` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Project_Group`
--

LOCK TABLES `Project_Group` WRITE;
/*!40000 ALTER TABLE `Project_Group` DISABLE KEYS */;
INSERT INTO `Project_Group` VALUES (1,1,'Group A'),(2,2,'Group A'),(3,3,'Group A'),(4,4,'Group A'),(5,5,'Group A'),(6,6,'Group A');
/*!40000 ALTER TABLE `Project_Group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Project_MBTI`
--

DROP TABLE IF EXISTS `Project_MBTI`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Project_MBTI` (
  `ProjectID` int NOT NULL,
  `MBTI_Code` char(4) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`ProjectID`,`MBTI_Code`),
  KEY `MBTI_Code` (`MBTI_Code`),
  CONSTRAINT `project_mbti_ibfk_1` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`),
  CONSTRAINT `project_mbti_ibfk_2` FOREIGN KEY (`MBTI_Code`) REFERENCES `MBTI_Type` (`MBTI_Code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Project_MBTI`
--

LOCK TABLES `Project_MBTI` WRITE;
/*!40000 ALTER TABLE `Project_MBTI` DISABLE KEYS */;
INSERT INTO `Project_MBTI` VALUES (2,'ENFP'),(5,'ENTP'),(6,'ESTJ'),(2,'INFJ'),(6,'INFJ'),(1,'INTJ'),(4,'INTJ'),(1,'INTP'),(4,'INTP'),(5,'ISTP');
/*!40000 ALTER TABLE `Project_MBTI` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Student`
--

DROP TABLE IF EXISTS `Student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Student` (
  `StudentID` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `Name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `DeptID` int NOT NULL,
  `MBTI_Code` char(4) COLLATE utf8mb4_general_ci NOT NULL,
  `EnrollmentYear` int DEFAULT NULL,
  `Email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'password123',
  `Is_Searchable` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`StudentID`),
  UNIQUE KEY `Email` (`Email`),
  KEY `DeptID` (`DeptID`),
  KEY `MBTI_Code` (`MBTI_Code`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`DeptID`) REFERENCES `Department` (`DeptID`),
  CONSTRAINT `student_ibfk_2` FOREIGN KEY (`MBTI_Code`) REFERENCES `MBTI_Type` (`MBTI_Code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Student`
--

LOCK TABLES `Student` WRITE;
/*!40000 ALTER TABLE `Student` DISABLE KEYS */;
INSERT INTO `Student` VALUES ('D1102031','Liam Smith',1,'INTJ',2024,'liam@example.com','password123',1),('D1102045','Sophia Chen',2,'ENFP',2024,'sophia@example.com','password123',1),('D1102089','Ethan Hunt',3,'ISTP',2023,'ethan@example.com','password123',0),('D1102102','Olivia Wang',4,'INFJ',2025,'olivia@example.com','password123',1),('D1102115','Lucas Garcia',1,'ENTP',2024,'lucas@example.com','password123',1),('D1102120','Emma Watson',2,'ISFJ',2024,'emma@example.com','password123',1),('D1102144','Alexander Wright',1,'INTP',2024,'alex@example.com','password123',1),('D1102159','Chloe Isabella',2,'ENFJ',2024,'chloe@example.com','password123',1),('D1102188','Daniel Craig',3,'ENTJ',2023,'daniel@example.com','password123',1),('D1102201','Grace Hopper',4,'INTJ',2025,'grace@example.com','password123',1),('D1102234','Benjamin Franklin',1,'ISTJ',2024,'ben@example.com','password123',1),('D1102255','Mia Wallace',2,'ESFP',2024,'mia@example.com','password123',0),('D1102277','Oliver Queen',3,'ISTP',2023,'oliver@example.com','password123',1),('D1102311','Emma Stone',4,'INFP',2025,'emmas@example.com','password123',1),('D1102345','Bruce Wayne',3,'INTJ',2023,'bruce@example.com','password123',1),('D1102400','Diana Prince',4,'INFJ',2025,'diana@example.com','password123',1);
/*!40000 ALTER TABLE `Student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Team_Matching`
--

DROP TABLE IF EXISTS `Team_Matching`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Team_Matching` (
  `ProjectID` int NOT NULL,
  `StudentID` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `GroupID` int DEFAULT NULL,
  `Match_Status` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'Pending',
  PRIMARY KEY (`ProjectID`,`StudentID`),
  KEY `StudentID` (`StudentID`),
  KEY `GroupID` (`GroupID`),
  CONSTRAINT `team_matching_ibfk_1` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`) ON DELETE CASCADE,
  CONSTRAINT `team_matching_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `Student` (`StudentID`) ON DELETE CASCADE,
  CONSTRAINT `team_matching_ibfk_3` FOREIGN KEY (`GroupID`) REFERENCES `Project_Group` (`GroupID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Team_Matching`
--

LOCK TABLES `Team_Matching` WRITE;
/*!40000 ALTER TABLE `Team_Matching` DISABLE KEYS */;
INSERT INTO `Team_Matching` VALUES (1,'D1102031',1,'Matched'),(1,'D1102115',1,'Pending'),(1,'D1102144',1,'Pending'),(2,'D1102045',2,'Matched'),(3,'D1102089',3,'Matched'),(4,'D1102144',4,'Pending'),(5,'D1102277',5,'Matched'),(6,'D1102159',6,'Pending');
/*!40000 ALTER TABLE `Team_Matching` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-26 12:50:29
