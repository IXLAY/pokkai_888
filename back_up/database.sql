-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for pokdeng
CREATE DATABASE IF NOT EXISTS `pokdeng` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `pokdeng`;

-- Dumping structure for table pokdeng.card
CREATE TABLE IF NOT EXISTS `card` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `card_id` text DEFAULT NULL,
  `point` int(11) DEFAULT NULL,
  `name` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `card_id` (`card_id`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pokdeng.card: ~52 rows (approximately)
INSERT INTO `card` (`id`, `card_id`, `point`, `name`) VALUES
	(1, '1s', 1, 'A โพดำ'),
	(2, '2s', 2, '2 โพดำ'),
	(3, '3s', 3, '3 โพดำ'),
	(4, '4s', 4, '4 โพดำ'),
	(5, '5s', 5, '5 โพดำ'),
	(6, '6s', 6, '6 โพดำ'),
	(7, '7s', 7, '7 โพดำ'),
	(8, '8s', 8, '8 โพดำ'),
	(9, '9s', 9, '9 โพดำ'),
	(10, '10s', 0, '10 โพดำ'),
	(11, 'Js', 0, 'J โพดำ'),
	(12, 'Qs', 0, 'Q โพดำ'),
	(13, 'Ks', 0, 'K โพดำ'),
	(14, '1h', 1, 'A โพแดง'),
	(15, '2h', 2, '2 โพแดง'),
	(16, '3h', 3, '3 โพแดง'),
	(17, '4h', 4, '4 โพแดง'),
	(18, '5h', 5, '5 โพแดง'),
	(19, '6h', 6, '6 โพแดง'),
	(20, '7h', 7, '7 โพแดง'),
	(21, '8h', 8, '8 โพแดง'),
	(22, '9h', 9, '9 โพแดง'),
	(23, '10h', 0, '10 โพแดง'),
	(24, 'Jh', 0, 'J โพแดง'),
	(25, 'Qh', 0, 'Q โพแดง'),
	(26, 'Kh', 0, 'K โพแดง'),
	(27, '1d', 1, 'A หลามตัด'),
	(28, '2d', 2, '2 หลามตัด '),
	(29, '3d', 3, '3 หลามตัด'),
	(30, '4d', 4, '4 หลามตัด'),
	(31, '5d', 5, '5 หลามตัด'),
	(32, '6d', 6, '6 หลามตัด'),
	(33, '7d', 7, '7 หลามตัด'),
	(34, '8d', 8, '8 หลามตัด'),
	(35, '9d', 9, '9 หลามตัด'),
	(36, '10d', 0, '10 หลามตัด'),
	(37, 'Jd', 0, 'J หลามตัด'),
	(38, 'Qd', 0, 'Q หลามตัด'),
	(39, 'Kd', 0, 'K หลามตัด'),
	(40, '1c', 1, 'A ดอกจิก'),
	(41, '2c', 2, '2 ดอกจิก'),
	(42, '3c', 3, '3 ดอกจิก'),
	(43, '4c', 4, '4 ดอกจิก'),
	(44, '5c', 5, '5 ดอกจิก'),
	(45, '6c', 6, '6 ดอกจิก'),
	(46, '7c', 7, '7 ดอกจิก'),
	(47, '8c', 8, '8 ดอกจิก'),
	(48, '9c', 9, '9 ดอกจิก'),
	(49, '10c', 0, '10 ดอกจิก'),
	(50, 'Jc', 0, 'J ดอกจิก'),
	(51, 'Qc', 0, 'Q ดอกจิก'),
	(52, 'Kc', 0, 'K ดอกจิก');

-- Dumping structure for table pokdeng.room
CREATE TABLE IF NOT EXISTS `room` (
  `room_id` text NOT NULL,
  `name` text NOT NULL,
  `people` int(11) NOT NULL DEFAULT 1,
  `password` text DEFAULT NULL,
  `createat` datetime NOT NULL DEFAULT current_timestamp(),
  UNIQUE KEY `room_id` (`room_id`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pokdeng.room: ~1 rows (approximately)
INSERT INTO `room` (`room_id`, `name`, `people`, `password`, `createat`) VALUES
	('2409', 'สุดใจ', 2, '123123', '2024-04-29 05:21:39');

-- Dumping structure for table pokdeng.room_user
CREATE TABLE IF NOT EXISTS `room_user` (
  `room_user_id` text NOT NULL,
  `user_id` text NOT NULL,
  `room_id` text NOT NULL,
  `result_point` int(11) NOT NULL,
  `bet` int(11) NOT NULL,
  `chair` int(11) NOT NULL,
  `bot` tinyint(1) DEFAULT 0,
  UNIQUE KEY `room_user_id` (`room_user_id`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pokdeng.room_user: ~1 rows (approximately)
INSERT INTO `room_user` (`room_user_id`, `user_id`, `room_id`, `result_point`, `bet`, `chair`, `bot`) VALUES
	('1042', '0', '2409', 6, 1, 0, 1),
	('1434', '6', '2409', 0, 0, 0, 0);

-- Dumping structure for table pokdeng.room_user_card
CREATE TABLE IF NOT EXISTS `room_user_card` (
  `room_user_id` text DEFAULT NULL,
  `card_id` text DEFAULT NULL,
  `room_id` text DEFAULT NULL,
  `point` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pokdeng.room_user_card: ~5 rows (approximately)
INSERT INTO `room_user_card` (`room_user_id`, `card_id`, `room_id`, `point`) VALUES
	('1042', '3d', '2409', 3),
	('1042', '3c', '2409', 3),
	('482', 'Jc', '2409', 0),
	('482', '6s', '2409', 6),
	('482', '4c', '2409', 4);

-- Dumping structure for table pokdeng.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `money` float NOT NULL DEFAULT 0,
  `round` int(11) NOT NULL,
  `round_win` int(11) NOT NULL,
  `winrate` float NOT NULL DEFAULT 0,
  `exp` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `createat` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pokdeng.users: ~6 rows (approximately)
INSERT INTO `users` (`user_id`, `username`, `password`, `money`, `round`, `round_win`, `winrate`, `exp`, `level`, `createat`) VALUES
	(1, 'IXLAY', '1234', 1008380, 1, 0, 0, 0, 0, '0000-00-00 00:00:00'),
	(2, 'talor', '2456', 11925, 0, 0, 0, 0, 0, '0000-00-00 00:00:00'),
	(3, 'ityedhod', 'xTwTx', 8000, 0, 0, 0, 0, 0, '0000-00-00 00:00:00'),
	(4, 'pun8pro', '290946', 8500, 0, 0, 0, 0, 0, '2024-04-11 19:53:06'),
	(5, 'anas007', 'anas007', 50000, 0, 0, 0, 0, 0, '2024-04-21 04:36:47'),
	(6, 'Mook', 'asd', 123128, 0, 0, 0, 0, 0, '2024-04-25 23:39:10');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
