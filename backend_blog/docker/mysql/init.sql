-- Create test database
CREATE DATABASE IF NOT EXISTS backend_blog_test;

-- Grant permissions
GRANT ALL PRIVILEGES ON backend_blog_dev.* TO 'backend_blog_user'@'%';
GRANT ALL PRIVILEGES ON backend_blog_test.* TO 'backend_blog_user'@'%';

-- Flush privileges
FLUSH PRIVILEGES;
