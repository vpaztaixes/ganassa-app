// TODO: Implement
const express = require('express');
const router = express.Router();
const db = require('../config/db');

const LANGS = ['en', 'ja', 'ko'];

// ============================
// SITEMAP.XML
// ============================
router.get('/sitemap.xml', async (req, res) => {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

    try {
        const pages = await db.getMany(
            "SELECT slug, updated_at FROM pages WHERE status = 'live' ORDER BY nav_order"
        );

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
        xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

        for (const page of pages) {
            const path = page.slug === 'home' ? '/' : `/${page.slug}`;
            const lastmod = page.updated_at
                ? new Date(page.updated_at).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];
            const priority = page.slug === 'home' ? '1.0' : '0.8';

            for (const lang of LANGS) {
                xml += `  <url>\n`;
                xml += `    <loc>${BASE_URL}/${lang}${path}</loc>\n`;

                for (const altLang of LANGS) {
                    xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${BASE_URL}/${altLang}${path}" />\n`;
                }
                xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/en${path}" />\n`;

                xml += `    <lastmod>${lastmod}</lastmod>\n`;
                xml += `    <priority>${priority}</priority>\n`;
                xml += `  </url>\n`;
            }
        }

        xml += `</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (err) {
        console.error('Sitemap error:', err);
        res.status(500).send('Error generating sitemap');
    }
});

// ============================
// ROBOTS.TXT
// ============================
router.get('/robots.txt', (req, res) => {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

    const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml

Disallow: /admin/
Disallow: /api/
`;
    res.header('Content-Type', 'text/plain');
    res.send(robots);
});

module.exports = router;