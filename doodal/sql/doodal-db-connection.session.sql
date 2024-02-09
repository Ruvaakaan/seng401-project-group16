CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    xp_level INT NOT NULL
);

INSERT INTO users (username, password, email, xp_level)
VALUES ('user1', 'password1', 'user1@example.com', 5);

-- CREATE VIEW IF NOT EXISTS user_information AS
-- SELECT *
-- FROM users;