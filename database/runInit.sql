-- Create database
CREATE DATABASE IF NOT EXISTS blog_platform;
USE blog_platform;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  INDEX idx_name (name)
) ENGINE=InnoDB;

-- Post-Tag junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS post_tags (
  post_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  INDEX idx_post_id (post_id),
  INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB;

-- Insert predefined tags
INSERT INTO tags (name) VALUES
  ('Technology'),
  ('Health and Wellness'),
  ('Finance'),
  ('Travel and Tourism'),
  ('Food'),
  ('Fashion'),
  ('Sports'),
  ('Fitness'),
  ('History'),
  ('Science'),
  ('Art'),
  ('Music'),
  ('Education'),
  ('Business'),
  ('Environment');
