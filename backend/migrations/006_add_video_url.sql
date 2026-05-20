-- Add video_url table
CREATE TABLE IF NOT EXISTS video_url (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    status INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
