-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 30, 2026 at 07:05 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mastermind_classes`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int(11) NOT NULL,
  `image_url` text NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `image_url`, `caption`, `order_index`, `created_at`) VALUES
(11, '/uploads/1774593512790-369706934.jpeg', '', 0, '2026-03-27 06:38:32'),
(12, '/uploads/1774593532920-350265870.jpeg', '', 0, '2026-03-27 06:38:52'),
(13, '/uploads/1774593564471-540346688.jpeg', '', 0, '2026-03-27 06:39:24'),
(14, '/uploads/1774593572033-623476898.jpeg', '', 0, '2026-03-27 06:39:32'),
(15, '/uploads/1774593593183-554946972.jpeg', '', 0, '2026-03-27 06:39:53'),
(16, '/uploads/1774593611788-923758625.jpeg', '', 0, '2026-03-27 06:40:11');

-- --------------------------------------------------------

--
-- Table structure for table `admin_auth`
--

CREATE TABLE `admin_auth` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_auth`
--

INSERT INTO `admin_auth` (`id`, `email`, `password`, `reset_token`, `reset_token_expiry`) VALUES
(1, 'info@mastermindclassesmbd.com', '$2b$10$.lV3NzP0YwgOsO8dTewskeC9pnxppR88sl1SS84S2WrT4wz6JEcn6', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `classes_offered`
--

CREATE TABLE `classes_offered` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT 'BookOpen',
  `order_index` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes_offered`
--

INSERT INTO `classes_offered` (`id`, `title`, `subtitle`, `description`, `icon`, `order_index`, `created_at`) VALUES
(1, 'Classes V – VIII', 'All Subjects', 'Building a strong foundation with focus on conceptual clarity in Mathematics, Science, English, and Social Studies.', 'BookOpen', 1, '2026-03-26 07:02:53'),
(2, 'Classes IX – X', 'All Subjects', 'Board exam preparation strategy with rigorous testing, doubt clearing sessions, and comprehensive study material.', 'Target', 2, '2026-03-26 07:02:53'),
(3, 'Classes XI – XII', 'PCM • PCB • Commerce • Humanities', 'Specialized faculty for each stream focusing on board excellence and competitive exam orientation.', 'Users', 3, '2026-03-26 07:02:53');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `class_level` varchar(255) DEFAULT NULL,
  `subjects` text DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `timing` varchar(255) DEFAULT NULL,
  `color` varchar(50) DEFAULT 'blue',
  `order_index` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `name`, `class_level`, `subjects`, `duration`, `timing`, `color`, `order_index`, `created_at`) VALUES
(1, 'Foundation Batch', 'Classes V – VIII', 'Mathematics, Science, English, Social Studies', '1 Year Academic Program', 'Evening Batches (4 PM - 7 PM)', 'blue', 1, '2026-03-26 07:14:51'),
(2, 'Board Preparation', 'Classes IX – X', 'Maths, Physics, Chemistry, Biology, English, SST', '1 Year Intensive Program', 'Evening Batches (4 PM - 8 PM)', 'purple', 2, '2026-03-26 07:14:51'),
(3, 'Science Excellence (PCM/PCB)', 'Classes XI – XII', 'Physics, Chemistry, Maths, Biology', '1 or 2 Year Integrated Program', 'Morning & Evening Batches', 'emerald', 3, '2026-03-26 07:14:51'),
(4, 'Commerce / Humanities', 'Classes XI – XII', 'Accountancy, Economics, Business Studies, History, Pol. Science', '1 or 2 Year Program', 'Evening Batches', 'amber', 4, '2026-03-26 07:14:51'),
(5, 'Competitive Exams (CUET)', 'Class XII Appeared/Passed', 'Domain Specific Subjects, General Test, Languages', 'Crash Course & Year-long', 'Flexible Timings', 'rose', 5, '2026-03-26 07:14:51'),
(6, 'Teaching Exams (CTET)', 'Graduates / B.Ed', 'Child Development, Pedagogy, Maths, EVS, Languages', '6 Months Comprehensive', 'Morning Batches', 'indigo', 6, '2026-03-26 07:14:51');

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `display_mode` varchar(20) DEFAULT 'cover',
  `zoom` float DEFAULT 1,
  `offset_x` int(11) DEFAULT 0,
  `offset_y` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`id`, `name`, `qualification`, `experience`, `subject`, `image`, `created_at`, `display_mode`, `zoom`, `offset_x`, `offset_y`) VALUES
(7, 'Amit Srivastava', 'C.S., M.COM, B.Ed, LLB, M.A.(Economics)', '20+ years', 'C.S.,M.COM,B.ED,LLB,M.A.(Economics)', '/uploads/1774595540134-935938457.jpeg', '2026-03-27 07:12:20', 'contain', 1.6, -1, 10),
(8, 'Aamish Kapoor', 'B.Sc, M.Sc, B.ed, Former CSIR Research Lab Project Associate, Ed Tech experience', '7+ years', '', '/uploads/1774595605360-485110194.jpeg', '2026-03-27 07:13:25', 'contain', 1.5, 0, 8),
(9, 'Muzakkir Husain', 'M.Sc.(PHYSICS), B.ed., IIT-JAM,P.H.D.(Pursuing)', '10+years', '', '/uploads/1774595670903-929588496.jpeg', '2026-03-27 07:14:30', 'cover', 1, 0, 0),
(10, 'Rohit Kumar', 'M.Sc(Mathematics), B.ed.', '10+years', '', '/uploads/1774595736551-521499286.jpeg', '2026-03-27 07:15:36', 'cover', 1, 0, 0),
(12, 'Runa Roy', 'M.A. ( English ), B.Ed ', '', '', '/uploads/1774595806879-859484876.jpeg', '2026-03-27 07:16:46', 'cover', 1, 0, 0),
(13, 'Shishir Sharma', '', '', '', '/uploads/1774595900112-700509061.jpeg', '2026-03-27 07:18:20', 'cover', 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `image_url` text NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `media_type` varchar(10) DEFAULT 'image'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `image_url`, `caption`, `category`, `created_at`, `media_type`) VALUES
(7, '/uploads/1774592740851-544134017.jpeg', '', '', '2026-03-27 06:25:40', 'image'),
(8, '/uploads/1774592747719-287952523.jpeg', '', '', '2026-03-27 06:25:47', 'image'),
(9, '/uploads/1774592753400-339703271.jpeg', '', '', '2026-03-27 06:25:53', 'image'),
(10, '/uploads/1774592769638-381701171.jpeg', '', '', '2026-03-27 06:26:09', 'image'),
(11, '/uploads/1774592776232-912496432.jpeg', '', '', '2026-03-27 06:26:16', 'image'),
(12, '/uploads/1774592783167-310723040.jpeg', '', '', '2026-03-27 06:26:23', 'image'),
(13, '/uploads/1774592793099-97131818.jpeg', '', '', '2026-03-27 06:26:33', 'image'),
(14, '/uploads/1774592802535-285022631.jpeg', '', '', '2026-03-27 06:26:42', 'image'),
(15, '/uploads/1774592810819-238198927.jpeg', '', '', '2026-03-27 06:26:50', 'image'),
(16, '/uploads/1774592825534-196253094.jpeg', '', '', '2026-03-27 06:27:05', 'image'),
(17, '/uploads/1774592833032-494740777.jpeg', '', '', '2026-03-27 06:27:13', 'image'),
(18, '/uploads/1774592840034-52171976.jpeg', '', '', '2026-03-27 06:27:20', 'image'),
(19, '/uploads/1774592847799-503945702.jpeg', '', '', '2026-03-27 06:27:27', 'image'),
(20, '/uploads/1774592854935-362725355.jpeg', '', '', '2026-03-27 06:27:34', 'image'),
(21, '/uploads/1774592869685-184250706.jpeg', '', '', '2026-03-27 06:27:49', 'image'),
(22, '/uploads/1774592878168-319311635.jpeg', '', '', '2026-03-27 06:27:58', 'image'),
(23, '/uploads/1774592888168-151527565.jpeg', '', '', '2026-03-27 06:28:08', 'image'),
(24, '/uploads/1774592914217-870952924.mp4', '', '', '2026-03-27 06:28:34', 'video');

-- --------------------------------------------------------

--
-- Table structure for table `inquiries`
--

CREATE TABLE `inquiries` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inquiries`
--

INSERT INTO `inquiries` (`id`, `name`, `phone`, `message`, `created_at`) VALUES
(1, 'prashant', '8630352442', 'test', '2026-03-18 06:50:27'),
(2, 'test', '8654112234', 'hello', '2026-03-18 07:12:08'),
(3, 'vivek', '8630352442', 'test', '2026-03-25 11:43:22'),
(4, 'prashant', '8630352442', 'test', '2026-03-25 11:45:09'),
(5, 'test', '8630352442', 'test', '2026-03-25 11:53:21'),
(6, 'test', '8630352442', 'test', '2026-03-26 07:14:32');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('cta_badge', 'prashant\'s Coaching '),
('cta_description', 'Join our expert-led batches specifically designed to help you crack competitive exams with top percentiles.'),
('cta_title', 'Preparing for Java and Python'),
('logo_url', '/uploads/1774438274686-572065663.png');

-- --------------------------------------------------------

--
-- Table structure for table `slides`
--

CREATE TABLE `slides` (
  `id` int(11) NOT NULL,
  `image_url` text NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `slides`
--

INSERT INTO `slides` (`id`, `image_url`, `title`, `subtitle`, `order_index`, `created_at`) VALUES
(6, '/uploads/1774593209113-150453433.jpeg', 'Unlock Your True Academic Potential', 'Guiding students toward excellence and confidence', 0, '2026-03-27 06:33:29'),
(7, '/uploads/1774593277639-678899924.jpeg', 'Learn, Grow, and Achieve More', 'Personalized coaching for every learner’s journey', 0, '2026-03-27 06:34:37'),
(8, '/uploads/1774593361090-751772916.jpeg', 'Shaping Bright and Brilliant Minds', 'Dedicated mentors, proven results, lasting impact', 0, '2026-03-27 06:36:01'),
(9, '/uploads/1774593407371-79675374.jpeg', 'Your Future Success Starts Here', 'Strong foundations for brighter opportunities', 0, '2026-03-27 06:36:47');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `class` varchar(50) DEFAULT NULL,
  `competitive_exam` varchar(100) DEFAULT NULL,
  `stream` varchar(50) DEFAULT NULL,
  `phone_number` varchar(15) NOT NULL,
  `parent_name` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `demo_requested` tinyint(1) DEFAULT 0,
  `registration_type` varchar(50) DEFAULT 'standard',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `student_name`, `class`, `competitive_exam`, `stream`, `phone_number`, `parent_name`, `address`, `demo_requested`, `registration_type`, `created_at`) VALUES
(1, 'test', 'Class V', NULL, NULL, '6397191095', 'test', 'moradabad', 0, 'standard', '2026-03-18 06:49:05'),
(2, 'prashant', 'Class XI', NULL, 'PCM', '6397191095', 'prashant', 'test', 1, 'standard', '2026-03-18 06:49:50'),
(3, 'test', 'Class XI', NULL, 'Commerce', '6397191095', 'test', 'moradabad', 0, 'free_first_25', '2026-03-18 06:57:33'),
(4, 'test', 'Class IV', NULL, NULL, '6397191095', 'test', '787', 1, 'free_first_25', '2026-03-18 09:52:29'),
(5, 'tanjeem', 'Class XI', NULL, 'PCB', '6397191095', 'test', 'moradabad', 1, 'free_first_25', '2026-03-18 10:06:40'),
(6, 'John Doe', 'Class X', NULL, NULL, '9876543210', 'Jane Doe', '123 Main St, City, Country', 0, 'standard', '2026-03-18 10:25:39'),
(7, 'avnish', 'Class XI', 'CUET', 'Commerce', '6397191095', 'avnish', 'test', 1, 'free_first_25', '2026-03-18 10:31:49'),
(8, 'pradeep', 'Class VI', 'CUET', NULL, '6397191095', 'pradeep ke papa', 'moradabad', 1, 'free_first_25', '2026-03-25 11:54:33'),
(9, 'pradeep', NULL, 'CTET', NULL, '8796536285', 'pradeep ke papa', 'test', 0, 'free_first_25', '2026-03-27 08:04:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin_auth`
--
ALTER TABLE `admin_auth`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `classes_offered`
--
ALTER TABLE `classes_offered`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faculty`
--
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `slides`
--
ALTER TABLE `slides`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `admin_auth`
--
ALTER TABLE `admin_auth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `classes_offered`
--
ALTER TABLE `classes_offered`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `faculty`
--
ALTER TABLE `faculty`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `slides`
--
ALTER TABLE `slides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


