const SUPPORTED_LANGS = ['en', 'ja', 'ko'];
const DEFAULT_LANG = 'en';

/**
 * Extracts language from URL param /:lang and validates it.
 * Sets req.lang and res.locals.lang for use in controllers and templates.
 * Redirects to /en/... if lang is invalid.
 */
function langMiddleware(req, res, next) {
    const lang = req.params.lang;

    if (!lang || !SUPPORTED_LANGS.includes(lang)) {
        // Build redirect: keep the rest of the path after the invalid lang
        const restOfPath = req.originalUrl.replace(/^\/[^/]*/, '');
        return res.redirect(301, `/en${restOfPath || '/'}`);
    }

    req.lang = lang;
    res.locals.lang = lang;
    res.locals.supportedLangs = SUPPORTED_LANGS;

    next();
}

module.exports = { langMiddleware, SUPPORTED_LANGS, DEFAULT_LANG };