// TODO: Implement
const db = require('../config/db');
const contentService = require('../services/contentService');

/**
 * Checks page status (draft / coming_soon / live) and acts accordingly:
 * - draft → 404
 * - coming_soon → renders coming soon page with noindex
 * - live → continues to controller
 */
async function checkPageStatus(req, res, next) {
    const slug = req.params.pageSlug || 'home';
    const lang = req.lang || 'en';

    try {
        const page = await db.getOne(
            'SELECT id, slug, status FROM pages WHERE slug = $1',
            [slug]
        );

        if (!page) {
            return render404(res, lang);
        }

        if (page.status === 'draft') {
            return render404(res, lang);
        }

        if (page.status === 'coming_soon') {
            const [seo, nav, settings] = await Promise.all([
                contentService.getSeoMetadata(page.id, lang),
                contentService.getNav(lang),
                contentService.getSettings(lang)
            ]);

            return res.render('partials/coming-soon', {
                lang,
                page,
                seo: seo || { title: 'Coming Soon | GANASSA', noindex: true },
                nav,
                settings,
                currentSlug: slug
            });
        }

        // status === 'live' → attach page and continue
        req.page = page;
        next();

    } catch (err) {
        console.error('checkPageStatus error:', err);
        next(err);
    }
}

/**
 * Render 404 with nav loaded.
 */
async function render404(res, lang) {
    let nav = [];
    let settings = {};
    try {
        nav = await contentService.getNav(lang);
        settings = await contentService.getSettings(lang);
    } catch (e) { /* fail silently */ }

    return res.status(404).render('pages/404', {
        lang,
        page: { slug: '404' },
        seo: { title: '404 - Page Not Found | GANASSA' },
        nav,
        settings,
        currentSlug: '404'
    });
}

module.exports = { checkPageStatus };