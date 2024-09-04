CREATE TABLE IF NOT EXISTS counter (
    id INT PRIMARY KEY,
    count INT NOT NULL
);

INSERT INTO counter (id, count) VALUES (1, 0)
ON DUPLICATE KEY UPDATE count=count;
