// TODO: Implement
const contentService = require('../services/contentService');
const db = require('../config/db');

/**
 * Builds the common data object every page template needs.
 */
async function buildPageData(req, pageSlug) {
    const lang = req.lang || 'en';
    const page = req.page; // set by checkPageStatus middleware

    const [seo, nav, settings, content] = await Promise.all([
        contentService.getSeoMetadata(page.id, lang),
        contentService.getNav(lang),
        contentService.getSettings(lang),
        contentService.getPageContent(pageSlug, lang)
    ]);

    return {
        lang,
        page,
        seo: seo || { title: 'GANASSA', description: '' },
        nav,
        settings,
        content,
        currentSlug: pageSlug
    };
}

// ============================
// HOME
// ============================
exports.home = async (req, res, next) => {
    try {
        const data = await buildPageData(req, 'home');
        const partners = await contentService.getPartners(req.lang);
        res.render('pages/home', { ...data, partners });
    } catch (err) { next(err); }
};

// ============================
// SERVICES
// ============================
exports.services = async (req, res, next) => {
    try {
        const data = await buildPageData(req, 'services');
        const services = await contentService.getServices(req.lang);
        res.render('pages/services', { ...data, services });
    } catch (err) { next(err); }
};

// ============================
// CLIENTS
// ============================
exports.clients = async (req, res, next) => {
    try {
        const data = await buildPageData(req, 'clients');
        const [clients, testimonials] = await Promise.all([
            contentService.getClients(),
            contentService.getTestimonials(req.lang)
        ]);
        res.render('pages/clients', { ...data, clients, testimonials });
    } catch (err) { next(err); }
};

// ============================
// TEAM
// ============================
exports.team = async (req, res, next) => {
    try {
        const data = await buildPageData(req, 'team');
        const teamMembers = await contentService.getTeamMembers(req.lang);
        res.render('pages/team', { ...data, teamMembers });
    } catch (err) { next(err); }
};

// ============================
// PARTNERS
// ============================
exports.partners = async (req, res, next) => {
    try {
        const data = await buildPageData(req, 'partners');
        const partnersList = await contentService.getPartners(req.lang);
        res.render('pages/partners', { ...data, partnersList });
    } catch (err) { next(err); }
};

// ============================
// CONTACT
// ============================
exports.contact = async (req, res, next) => {
    try {
        const data = await buildPageData(req, 'contact');
        const [faqItems, contactFormFields] = await Promise.all([
            contentService.getFaqItems('contact', req.lang),
            db.getMany(
                `SELECT field_type, field_name, label_en, label_ja, label_ko, placeholder_en, placeholder_ja, placeholder_ko, is_required, is_visible, sort_order, options_json
                 FROM form_fields WHERE form_id = 'contact' AND is_visible = true ORDER BY sort_order ASC, id ASC`
            ).catch(() => [])
        ]);
        res.render('pages/contact', { ...data, faqItems, contactFormFields });
    } catch (err) { next(err); }
};

// ============================
// TOKYO SUMMIT
// ============================
exports.tokyoSummit = async (req, res, next) => {
    try {
        const data = await buildPageData(req, 'tokyo-summit-2026');
        const summitFormFields = await db.getMany(
            `SELECT field_type, field_name, label_en, label_ja, label_ko, placeholder_en, placeholder_ja, placeholder_ko, is_required, is_visible, sort_order, options_json
             FROM form_fields WHERE form_id = 'summit' AND is_visible = true ORDER BY sort_order ASC, id ASC`
        ).catch(() => []);
        res.render('pages/tokyo-summit', { ...data, summitFormFields });
    } catch (err) { next(err); }
};