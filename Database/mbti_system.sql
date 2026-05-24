-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 24, 2026 at 09:24 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mbti_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `Course`
--

CREATE TABLE `Course` (
  `CourseID` int(11) NOT NULL,
  `CourseName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Course`
--

INSERT INTO `Course` (`CourseID`, `CourseName`) VALUES
(104, 'Data Structures'),
(101, 'Introduction to Python'),
(103, 'Network Security'),
(102, 'Web Development');

-- --------------------------------------------------------

--
-- Table structure for table `Course_Feedback`
--

CREATE TABLE `Course_Feedback` (
  `FeedbackID` int(11) NOT NULL,
  `CourseID` int(11) DEFAULT NULL,
  `StudentID` varchar(20) DEFAULT NULL,
  `Rating` int(11) DEFAULT NULL,
  `Comments` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Course_Feedback`
--

INSERT INTO `Course_Feedback` (`FeedbackID`, `CourseID`, `StudentID`, `Rating`, `Comments`) VALUES
(1, 101, 'D1102031', 5, 'Great for beginners!'),
(2, 102, 'D1102045', 4, 'Very practical.'),
(3, 101, 'D1102115', 4, 'Enjoyed the assignments, python basics were clear.'),
(4, 103, 'D1102089', 5, 'Vulnerability scanning tools were super cool to learn!'),
(5, 104, 'D1102144', 3, 'Binary trees were a bit tough to wrap my head around.'),
(6, 102, 'D1102159', 5, 'Tailwind CSS config section was incredibly helpful.');

-- --------------------------------------------------------

--
-- Table structure for table `Department`
--

CREATE TABLE `Department` (
  `DeptID` int(11) NOT NULL,
  `DeptName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Department`
--

INSERT INTO `Department` (`DeptID`, `DeptName`) VALUES
(1, 'Computer Science'),
(3, 'Cybersecurity'),
(2, 'Information Technology'),
(4, 'Software Engineering');

-- --------------------------------------------------------

--
-- Table structure for table `MBTI_Type`
--

CREATE TABLE `MBTI_Type` (
  `MBTI_Code` char(4) NOT NULL,
  `Title` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `MBTI_Type`
--

INSERT INTO `MBTI_Type` (`MBTI_Code`, `Title`, `Description`) VALUES
('ENFJ', 'Protagonist', 'Charismatic leaders.'),
('ENFP', 'Campaigner', 'Enthusiastic people.'),
('ENTJ', 'Commander', 'Bold leaders.'),
('ENTP', 'Debater', 'Smart thinkers.'),
('ESFJ', 'Consul', 'Social and caring.'),
('ESFP', 'Entertainer', 'Spontaneous people.'),
('ESTJ', 'Executive', 'Efficient administrators.'),
('ESTP', 'Entrepreneur', 'Energetic people.'),
('INFJ', 'Advocate', 'Quiet and inspiring.'),
('INFP', 'Mediator', 'Poetic and kind.'),
('INTJ', 'Architect', 'Strategic thinkers.'),
('INTP', 'Logician', 'Innovative inventors.'),
('ISFJ', 'Defender', 'Dedicated protectors.'),
('ISFP', 'Adventurer', 'Flexible artists.'),
('ISTJ', 'Logistican', 'Practical and fact-minded.'),
('ISTP', 'Virtuoso', 'Bold and practical.');

-- --------------------------------------------------------

--
-- Table structure for table `Project`
--

CREATE TABLE `Project` (
  `ProjectID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `Status` varchar(20) DEFAULT 'Open'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Project`
--

INSERT INTO `Project` (`ProjectID`, `Title`, `Description`, `Status`) VALUES
(1, 'AI Chatbot Development', 'Developing a Python-based chatbot.', 'Open'),
(2, 'Web Portfolio System', 'A collaborative React project.', 'In Progress'),
(3, 'Cybersecurity Audit', 'Analyzing local network vulnerabilities.', 'Open'),
(4, 'Blockchain Identity Ledger', 'Researching decentralized identity verification via Solidity.', 'Open'),
(5, 'Cloud Pentesting Automator', 'Developing an automated AWS/Azure environment scanner.', 'Open'),
(6, 'E-Commerce Microservices', 'Refactoring a monolithic web application into Docker microservices.', 'In Progress');

-- --------------------------------------------------------

--
-- Table structure for table `Project_Department`
--

CREATE TABLE `Project_Department` (
  `ProjectID` int(11) NOT NULL,
  `DeptID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Project_Department`
--

INSERT INTO `Project_Department` (`ProjectID`, `DeptID`) VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 3),
(4, 1),
(4, 4),
(5, 3),
(6, 2),
(6, 4);

-- --------------------------------------------------------

--
-- Table structure for table `Project_MBTI`
--

CREATE TABLE `Project_MBTI` (
  `ProjectID` int(11) NOT NULL,
  `MBTI_Code` char(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Project_MBTI`
--

INSERT INTO `Project_MBTI` (`ProjectID`, `MBTI_Code`) VALUES
(1, 'INTJ'),
(1, 'INTP'),
(2, 'ENFP'),
(2, 'INFJ'),
(4, 'INTJ'),
(4, 'INTP'),
(5, 'ENTP'),
(5, 'ISTP'),
(6, 'ESTJ'),
(6, 'INFJ');

-- --------------------------------------------------------

--
-- Table structure for table `Student`
--

CREATE TABLE `Student` (
  `StudentID` varchar(20) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `DeptID` int(11) NOT NULL,
  `MBTI_Code` char(4) NOT NULL,
  `EnrollmentYear` int(11) DEFAULT NULL,
  `Email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL DEFAULT 'password123',
  `Is_Searchable` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Student`
--

INSERT INTO `Student` (`StudentID`, `Name`, `DeptID`, `MBTI_Code`, `EnrollmentYear`, `Email`, `password`, `Is_Searchable`) VALUES
('D1102031', 'Liam Smith', 1, 'INTJ', 2024, 'liam@example.com', 'password123', 1),
('D1102045', 'Sophia Chen', 2, 'ENFP', 2024, 'sophia@example.com', 'password123', 1),
('D1102089', 'Ethan Hunt', 3, 'ISTP', 2023, 'ethan@example.com', 'password123', 0),
('D1102102', 'Olivia Wang', 4, 'INFJ', 2025, 'olivia@example.com', 'password123', 1),
('D1102115', 'Lucas Garcia', 1, 'ENTP', 2024, 'lucas@example.com', 'password123', 1),
('D1102120', 'Emma Watson', 2, 'ISFJ', 2024, 'emma@example.com', 'password123', 1),
('D1102144', 'Alexander Wright', 1, 'INTP', 2024, 'alex@example.com', 'password123', 1),
('D1102159', 'Chloe Isabella', 2, 'ENFJ', 2024, 'chloe@example.com', 'password123', 1),
('D1102188', 'Daniel Craig', 3, 'ENTJ', 2023, 'daniel@example.com', 'password123', 1),
('D1102201', 'Grace Hopper', 4, 'INTJ', 2025, 'grace@example.com', 'password123', 1),
('D1102234', 'Benjamin Franklin', 1, 'ISTJ', 2024, 'ben@example.com', 'password123', 1),
('D1102255', 'Mia Wallace', 2, 'ESFP', 2024, 'mia@example.com', 'password123', 0),
('D1102277', 'Oliver Queen', 3, 'ISTP', 2023, 'oliver@example.com', 'password123', 1),
('D1102311', 'Emma Stone', 4, 'INFP', 2025, 'emmas@example.com', 'password123', 1),
('D1102345', 'Bruce Wayne', 3, 'INTJ', 2023, 'bruce@example.com', 'password123', 1),
('D1102400', 'Diana Prince', 4, 'INFJ', 2025, 'diana@example.com', 'password123', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Team_Matching`
--

CREATE TABLE `Team_Matching` (
  `ProjectID` int(11) NOT NULL,
  `StudentID` varchar(20) NOT NULL,
  `Match_Status` varchar(20) DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Team_Matching`
--

INSERT INTO `Team_Matching` (`ProjectID`, `StudentID`, `Match_Status`) VALUES
(1, 'D1102031', 'Matched'),
(1, 'D1102115', 'Pending'),
(1, 'D1102144', 'Pending'),
(2, 'D1102045', 'Matched'),
(3, 'D1102089', 'Matched'),
(4, 'D1102144', 'Pending'),
(5, 'D1102277', 'Matched'),
(6, 'D1102159', 'Pending');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Course`
--
ALTER TABLE `Course`
  ADD PRIMARY KEY (`CourseID`),
  ADD UNIQUE KEY `CourseName` (`CourseName`);

--
-- Indexes for table `Course_Feedback`
--
ALTER TABLE `Course_Feedback`
  ADD PRIMARY KEY (`FeedbackID`),
  ADD KEY `CourseID` (`CourseID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Indexes for table `Department`
--
ALTER TABLE `Department`
  ADD PRIMARY KEY (`DeptID`),
  ADD UNIQUE KEY `DeptName` (`DeptName`);

--
-- Indexes for table `MBTI_Type`
--
ALTER TABLE `MBTI_Type`
  ADD PRIMARY KEY (`MBTI_Code`);

--
-- Indexes for table `Project`
--
ALTER TABLE `Project`
  ADD PRIMARY KEY (`ProjectID`);

--
-- Indexes for table `Project_Department`
--
ALTER TABLE `Project_Department`
  ADD PRIMARY KEY (`ProjectID`,`DeptID`),
  ADD KEY `DeptID` (`DeptID`);

--
-- Indexes for table `Project_MBTI`
--
ALTER TABLE `Project_MBTI`
  ADD PRIMARY KEY (`ProjectID`,`MBTI_Code`),
  ADD KEY `MBTI_Code` (`MBTI_Code`);

--
-- Indexes for table `Student`
--
ALTER TABLE `Student`
  ADD PRIMARY KEY (`StudentID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `DeptID` (`DeptID`),
  ADD KEY `MBTI_Code` (`MBTI_Code`);

--
-- Indexes for table `Team_Matching`
--
ALTER TABLE `Team_Matching`
  ADD PRIMARY KEY (`ProjectID`,`StudentID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Course_Feedback`
--
ALTER TABLE `Course_Feedback`
  MODIFY `FeedbackID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Project`
--
ALTER TABLE `Project`
  MODIFY `ProjectID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Course_Feedback`
--
ALTER TABLE `Course_Feedback`
  ADD CONSTRAINT `course_feedback_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `Course` (`CourseID`),
  ADD CONSTRAINT `course_feedback_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `Student` (`StudentID`);

--
-- Constraints for table `Project_Department`
--
ALTER TABLE `Project_Department`
  ADD CONSTRAINT `project_department_ibfk_1` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`),
  ADD CONSTRAINT `project_department_ibfk_2` FOREIGN KEY (`DeptID`) REFERENCES `Department` (`DeptID`);

--
-- Constraints for table `Project_MBTI`
--
ALTER TABLE `Project_MBTI`
  ADD CONSTRAINT `project_mbti_ibfk_1` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`),
  ADD CONSTRAINT `project_mbti_ibfk_2` FOREIGN KEY (`MBTI_Code`) REFERENCES `MBTI_Type` (`MBTI_Code`);

--
-- Constraints for table `Student`
--
ALTER TABLE `Student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`DeptID`) REFERENCES `Department` (`DeptID`),
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`MBTI_Code`) REFERENCES `MBTI_Type` (`MBTI_Code`);

--
-- Constraints for table `Team_Matching`
--
ALTER TABLE `Team_Matching`
  ADD CONSTRAINT `team_matching_ibfk_1` FOREIGN KEY (`ProjectID`) REFERENCES `Project` (`ProjectID`),
  ADD CONSTRAINT `team_matching_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `Student` (`StudentID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
