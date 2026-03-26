// TODO: Implement
const express = require('express');
const router = express.Router();
const { langMiddleware } = require('../middleware/lang');
const { checkPageStatus } = require('../middleware/pageStatus');
const pageController = require('../controllers/pageController');

/**
 * Sets the page slug on req.params before checkPageStatus runs.
 */
function setPageSlug(slug) {
    return (req, res, next) => {
        req.params.pageSlug = slug;
        next();
    };
}

// ============================
// Home: /:lang/
// ============================
router.get('/:lang/', langMiddleware, setPageSlug('home'), checkPageStatus, pageController.home);
router.get('/:lang', langMiddleware, (req, res) => res.redirect(301, `/${req.params.lang}/`));

// ============================
// Services: /:lang/services
// ============================
router.get('/:lang/services', langMiddleware, setPageSlug('services'), checkPageStatus, pageController.services);

// ============================
// Clients: /:lang/clients
// ============================
router.get('/:lang/clients', langMiddleware, setPageSlug('clients'), checkPageStatus, pageController.clients);

// ============================
// Team: /:lang/team
// ============================
router.get('/:lang/team', langMiddleware, setPageSlug('team'), checkPageStatus, pageController.team);

// ============================
// Contact: /:lang/contact
// ============================
router.get('/:lang/contact', langMiddleware, setPageSlug('contact'), checkPageStatus, pageController.contact);

// ============================
// Tokyo Summit: /:lang/tokyo-summit-2026
// ============================
router.get('/:lang/tokyo-summit-2026', langMiddleware, setPageSlug('tokyo-summit-2026'), checkPageStatus, pageController.tokyoSummit);

module.exports = router;