-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS mastermind_classes;

USE mastermind_classes;

-- Create Students (Registration) Table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(100) NOT NULL,
  \`class\` VARCHAR(50),
  competitive_exam VARCHAR(100),
  stream VARCHAR(50),
  phone_number VARCHAR(15) NOT NULL,
  parent_name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  demo_requested BOOLEAN DEFAULT FALSE,
  registration_type VARCHAR(50) DEFAULT 'standard',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Inquiries (Contact) Table
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Slides Table
CREATE TABLE IF NOT EXISTS slides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  subtitle TEXT,
  \`order_index\` INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption VARCHAR(255),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Settings Table
CREATE TABLE IF NOT EXISTS settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT
);

-- Create Faculty Table
CREATE TABLE IF NOT EXISTS faculty (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  qualification VARCHAR(255),
  experience VARCHAR(255),
  subject VARCHAR(255),
  image TEXT,
  display_mode VARCHAR(20) DEFAULT 'cover',
  zoom FLOAT DEFAULT 1.0,
  offset_x INT DEFAULT 0,
  offset_y INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Classes Offered Table
CREATE TABLE IF NOT EXISTS classes_offered (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  icon VARCHAR(50) DEFAULT 'BookOpen',
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  class_level VARCHAR(255),
  subjects TEXT,
  duration VARCHAR(255),
  timing VARCHAR(255),
  color VARCHAR(50) DEFAULT 'blue',
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Admin Auth Table
CREATE TABLE IF NOT EXISTS admin_auth (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP NULL
);

