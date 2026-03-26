// TODO: Implement
const db = require('../config/db');

/**
 * Get all content blocks for a page in the requested language.
 * Returns nested object: { hero: { title: '...', subtitle: '...' }, stats: { ... } }
 */
async function getPageContent(pageSlug, lang = 'en') {
    const col = `content_${lang}`;

    const rows = await db.getMany(
        `SELECT cb.section, cb.block_key, cb.${col} as content, cb.block_type, cb.is_visible
         FROM content_blocks cb
         JOIN pages p ON cb.page_id = p.id
         WHERE p.slug = $1 AND cb.is_visible = true
         ORDER BY cb.section, cb.sort_order`,
        [pageSlug]
    );

    const content = {};
    for (const row of rows) {
        if (!content[row.section]) content[row.section] = {};
        content[row.section][row.block_key] = row.content || '';
    }
    return content;
}

/**
 * Get SEO metadata for a page + language.
 */
async function getSeoMetadata(pageId, lang = 'en') {
    return db.getOne(
        'SELECT * FROM seo_metadata WHERE page_id = $1 AND lang = $2',
        [pageId, lang]
    );
}

/**
 * Get navigation items (only pages that are visible in nav and not draft).
 */
async function getNav(lang = 'en') {
    const col = `nav_label_${lang}`;
    return db.getMany(
        `SELECT slug, ${col} as label, nav_class, status
         FROM pages
         WHERE show_in_nav = true AND status != 'draft'
         ORDER BY nav_order ASC`
    );
}

/**
 * Get a page by slug.
 */
async function getPage(slug) {
    return db.getOne('SELECT * FROM pages WHERE slug = $1', [slug]);
}

/**
 * Get team members in the requested language.
 */
async function getTeamMembers(lang = 'en') {
    const safeLang = ['en', 'ja', 'ko'].includes(lang) ? lang : 'en';
    return db.getMany(
        `SELECT id, name,
                COALESCE(NULLIF(position_${safeLang}, ''), position_en) as position,
                COALESCE(NULLIF(bio_${safeLang}, ''), bio_en) as bio,
                photo_url, department, field_position, linkedin_url, sort_order
         FROM team_members
         WHERE is_visible = true
         ORDER BY sort_order ASC`
    );
}

/**
 * Get all visible clients.
 */
async function getClients() {
    return db.getMany(
        `SELECT id, name, logo_url, category
         FROM clients
         WHERE is_visible = true
         ORDER BY sort_order ASC`
    );
}

/**
 * Get partners in the requested language.
 */
async function getPartners(lang = 'en') {
    const safeLang = ['en', 'ja', 'ko'].includes(lang) ? lang : 'en';
    return db.getMany(
        `SELECT id, name, logo_url, category, country,
                COALESCE(NULLIF(description_${safeLang}, ''), description_en) as description
         FROM partners
         WHERE is_visible = true
         ORDER BY sort_order ASC`
    );
}

/**
 * Get testimonials in the requested language.
 */
async function getTestimonials(lang = 'en') {
    const safeLang = ['en', 'ja', 'ko'].includes(lang) ? lang : 'en';
    return db.getMany(
        `SELECT id, author_name,
                COALESCE(NULLIF(author_position_${safeLang}, ''), author_position_en) as author_position,
                author_avatar_url, team_logo_url,
                COALESCE(NULLIF(quote_${safeLang}, ''), quote_en) as quote
         FROM testimonials
         WHERE is_visible = true
         ORDER BY sort_order ASC`
    );
}

/**
 * Get services in the requested language.
 */
async function getServices(lang = 'en') {
    const titleCol = `title_${lang}`;
    const subtitleCol = `subtitle_${lang}`;
    const descCol = `description_${lang}`;
    const featuresCol = `features_${lang}`;
    return db.getMany(
        `SELECT id, slug, icon_class, image_url, ${titleCol} as title,
                ${subtitleCol} as subtitle, ${descCol} as description,
                ${featuresCol} as features
         FROM services
         WHERE is_visible = true
         ORDER BY sort_order ASC`
    );
}

/**
 * Get FAQ items for a specific page in the requested language.
 */
async function getFaqItems(pageSlug, lang = 'en') {
    const qCol = `question_${lang}`;
    const aCol = `answer_${lang}`;
    const catCol = `category_${lang}`;
    return db.getMany(
        `SELECT fi.id,
                COALESCE(NULLIF(fi.${qCol}, ''), fi.question_en) as question,
                COALESCE(NULLIF(fi.${aCol}, ''), fi.answer_en) as answer,
                COALESCE(NULLIF(fi.${catCol}, ''), fi.category_en, '') as category
         FROM faq_items fi
         JOIN pages p ON fi.page_id = p.id
         WHERE p.slug = $1 AND fi.is_visible = true
         ORDER BY fi.sort_order ASC`,
        [pageSlug]
    );
}

/**
 * Get all site settings as a flat object: { site_name: '...', contact_email: '...' }
 */
async function getSettings(lang = 'en') {
    const safeLang = ['en', 'ja', 'ko'].includes(lang) ? lang : 'en';
    const col = `value_${safeLang}`;
    // COALESCE: if language-specific value is empty, fall back to value_en
    // This ensures language-agnostic settings (feature flags, etc.) always work
    const rows = await db.getMany(
        `SELECT key, COALESCE(NULLIF(${col}, ''), value_en) as value FROM site_settings`
    );
    const settings = {};
    for (const row of rows) {
        settings[row.key] = row.value || '';
    }
    return settings;
}

module.exports = {
    getPageContent,
    getSeoMetadata,
    getNav,
    getPage,
    getTeamMembers,
    getClients,
    getPartners,
    getTestimonials,
    getServices,
    getFaqItems,
    getSettings
};