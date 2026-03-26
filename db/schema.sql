-- =============================================
-- GANASSA DATABASE SCHEMA
-- Run this on your Supabase PostgreSQL instance
-- =============================================

-- Clean start (careful in production!)
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS faq_items CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS content_blocks CASCADE;
DROP TABLE IF EXISTS seo_metadata CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- =============================================
-- ADMIN USERS
-- =============================================
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- PAGES
-- =============================================
CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'live' CHECK (status IN ('draft', 'coming_soon', 'live')),
    show_in_nav BOOLEAN DEFAULT true,
    nav_order INT DEFAULT 0,
    nav_label_en VARCHAR(100),
    nav_label_ja VARCHAR(100),
    nav_label_ko VARCHAR(100),
    nav_class VARCHAR(50) DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- SEO METADATA
-- =============================================
CREATE TABLE seo_metadata (
    id SERIAL PRIMARY KEY,
    page_id INT REFERENCES pages(id) ON DELETE CASCADE,
    lang VARCHAR(5) NOT NULL,
    title VARCHAR(255),
    description VARCHAR(500),
    og_title VARCHAR(255),
    og_description VARCHAR(500),
    og_image VARCHAR(500),
    noindex BOOLEAN DEFAULT false,
    canonical_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(page_id, lang)
);

-- =============================================
-- CONTENT BLOCKS
-- =============================================
CREATE TABLE content_blocks (
    id SERIAL PRIMARY KEY,
    page_id INT REFERENCES pages(id) ON DELETE CASCADE,
    section VARCHAR(100) NOT NULL,
    block_key VARCHAR(100) NOT NULL,
    content_en TEXT,
    content_ja TEXT,
    content_ko TEXT,
    block_type VARCHAR(20) DEFAULT 'text',
    sort_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(page_id, section, block_key)
);

-- =============================================
-- TEAM MEMBERS
-- =============================================
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position_en VARCHAR(200),
    position_ja VARCHAR(200),
    position_ko VARCHAR(200),
    bio_en TEXT,
    bio_ja TEXT,
    bio_ko TEXT,
    photo_url VARCHAR(500),
    department VARCHAR(50),
    field_position VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- CLIENTS
-- =============================================
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    category VARCHAR(50),
    is_visible BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- PARTNERS
-- =============================================
CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    category VARCHAR(50),
    description_en TEXT,
    description_ja TEXT,
    description_ko TEXT,
    country VARCHAR(100),
    is_visible BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- TESTIMONIALS
-- =============================================
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    author_name VARCHAR(100),
    author_position_en VARCHAR(200),
    author_position_ja VARCHAR(200),
    author_position_ko VARCHAR(200),
    author_avatar_url VARCHAR(500),
    team_logo_url VARCHAR(500),
    quote_en TEXT,
    quote_ja TEXT,
    quote_ko TEXT,
    is_visible BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- SERVICES
-- =============================================
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon_class VARCHAR(100),
    image_url VARCHAR(500),
    title_en VARCHAR(200),
    title_ja VARCHAR(200),
    title_ko VARCHAR(200),
    subtitle_en TEXT,
    subtitle_ja TEXT,
    subtitle_ko TEXT,
    description_en TEXT,
    description_ja TEXT,
    description_ko TEXT,
    features_en JSONB DEFAULT '[]',
    features_ja JSONB DEFAULT '[]',
    features_ko JSONB DEFAULT '[]',
    is_visible BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- FAQ ITEMS
-- =============================================
CREATE TABLE faq_items (
    id SERIAL PRIMARY KEY,
    page_id INT REFERENCES pages(id) ON DELETE CASCADE,
    question_en TEXT,
    question_ja TEXT,
    question_ko TEXT,
    answer_en TEXT,
    answer_ja TEXT,
    answer_ko TEXT,
    is_visible BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- CONTACT SUBMISSIONS
-- =============================================
CREATE TABLE contact_submissions (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    company VARCHAR(200),
    message TEXT,
    source_page VARCHAR(50) DEFAULT 'contact',
    phone VARCHAR(50),
    position VARCHAR(200),
    country VARCHAR(100),
    ticket_type VARCHAR(50),
    special_requirements TEXT,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- SITE SETTINGS
-- =============================================
CREATE TABLE site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value_en TEXT,
    value_ja TEXT,
    value_ko TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_content_blocks_page ON content_blocks(page_id);
CREATE INDEX idx_content_blocks_lookup ON content_blocks(page_id, section, block_key);
CREATE INDEX idx_seo_page_lang ON seo_metadata(page_id, lang);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_submissions_status ON contact_submissions(status);
CREATE INDEX idx_submissions_date ON contact_submissions(created_at DESC);