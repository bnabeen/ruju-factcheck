-- CMS Upgrade Migration
-- Adds site_settings, article_versions, media_uploads tables
-- Extends articles table with structured fact-check fields

-- Site Settings Table (for dynamic navigation, footer, branding)
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Article Versions Table (for revision history)
CREATE TABLE IF NOT EXISTS article_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    title_en TEXT,
    title_np TEXT,
    summary_en TEXT,
    summary_np TEXT,
    content_en TEXT,
    content_np TEXT,
    verdict VARCHAR(50),
    category VARCHAR(100),
    image_url TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(article_id, version_number)
);

-- Media Uploads Table (for file management)
CREATE TABLE IF NOT EXISTS media_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Extend articles table with new structured fields
ALTER TABLE articles ADD COLUMN IF NOT EXISTS claim_source_url TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS evidence_urls JSONB DEFAULT '[]';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS schema_markup JSONB;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS claim_text TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS investigation_text TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS evidence_text TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS conclusion_text TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS version_number INTEGER DEFAULT 1;

-- Extend claims table to support file uploads
ALTER TABLE claims ADD COLUMN IF NOT EXISTS evidence_file_path TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS evidence_file_name TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_article_versions_article ON article_versions(article_id);
CREATE INDEX IF NOT EXISTS idx_media_uploads_user ON media_uploads(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
('navigation', '{
    "links": [
        {"label": "Home", "url": "/", "label_np": "गृहपृष्ठ"},
        {"label": "Verify Claim", "url": "/verify", "label_np": "दाबी परीक्षण"},
        {"label": "Media Check", "url": "/media", "label_np": "मिडिया जाँच"},
        {"label": "Latest Facts", "url": "/feed", "label_np": "ताजा तथ्य"},
        {"label": "Submit Claim", "url": "/submit", "label_np": "दाबी पेश"},
        {"label": "Donate", "url": "/donate", "label_np": "सहयोग"}
    ]
}'),
('footer_resources', '{
    "links": [
        {"label": "About", "url": "/about", "label_np": "हाम्रो बारे"},
        {"label": "Methodology", "url": "/methodology", "label_np": "कार्यविधि"},
        {"label": "Our Team", "url": "/team", "label_np": "हाम्रो टोली"},
        {"label": "Careers", "url": "/careers", "label_np": "करियर"},
        {"label": "Media Literacy", "url": "/resources", "label_np": "मिडिया साक्षरता"},
        {"label": "Terms", "url": "/terms", "label_np": "नियम"},
        {"label": "Privacy", "url": "/privacy", "label_np": "गोपनीयता"},
        {"label": "Contact", "url": "/contact", "label_np": "सम्पर्क"}
    ]
}'),
('branding', '{
    "logo_url": "",
    "tagline_en": "Verifying truth in the digital age.",
    "tagline_np": "डिजिटल युगमा सत्यको प्रमाणीकरण।"
}')
ON CONFLICT (setting_key) DO NOTHING;
