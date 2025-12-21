-- Migration 005: Add Article Slug
-- This migration adds the slug column to articles table.

ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

-- Generate initial slugs for existing articles based on title_en
UPDATE articles SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title_en, '[^\w\s-]', '', 'g'), '\s+', '-', 'g')) WHERE slug IS NULL;

-- Make slug NOT NULL after generation
ALTER TABLE articles ALTER COLUMN slug SET NOT NULL;

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
