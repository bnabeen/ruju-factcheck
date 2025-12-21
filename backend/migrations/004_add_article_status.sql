-- Migration 004: Add Article Status
-- This migration adds the status column to articles and article_versions tables.

-- Add status to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED'));

-- Add status to article_versions table
ALTER TABLE article_versions ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'DRAFT';

-- Update existing articles to have a status if they don't
UPDATE articles SET status = 'PUBLISHED' WHERE published_at IS NOT NULL AND status IS NULL;
UPDATE articles SET status = 'DRAFT' WHERE status IS NULL;
