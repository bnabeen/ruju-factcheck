-- CMS Schema Migration
-- Creates tables for dynamic content, careers, and job applications

-- Site Content Table (for dynamic pages like About, Terms, etc.)
CREATE TABLE IF NOT EXISTS site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    meta_description TEXT,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Careers/Job Listings Table
CREATE TABLE IF NOT EXISTS careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    location VARCHAR(100),
    type VARCHAR(50), -- 'full-time', 'part-time', 'internship'
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id UUID REFERENCES careers(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    cover_letter TEXT,
    resume_url TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewed', 'shortlisted', 'rejected'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_site_content_slug ON site_content(slug);
CREATE INDEX IF NOT EXISTS idx_careers_active ON careers(is_active);
CREATE INDEX IF NOT EXISTS idx_job_applications_career ON job_applications(career_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);

-- Insert default content pages
INSERT INTO site_content (slug, title, content, meta_description) VALUES
('about', 'About RUJU', 'RUJU (meaning "Verification" in Nepali) is an independent initiative dedicated to combating misinformation in the digital age.', 'Learn about RUJU FactCheck mission and values'),
('terms', 'Terms and Conditions', 'Please read these terms carefully before using our platform.', 'RUJU FactCheck Terms and Conditions'),
('privacy', 'Privacy Policy', 'We respect your privacy and are committed to protecting your personal data.', 'RUJU FactCheck Privacy Policy'),
('media-literacy', 'Media Literacy', 'Learn how to identify misinformation and verify claims yourself.', 'Media literacy resources and guides')
ON CONFLICT (slug) DO NOTHING;
