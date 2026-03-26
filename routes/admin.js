// TODO: Implement
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// ============================
// Login page (public)
// ============================
router.get('/login', (req, res) => {
    res.render('admin/login', {
        lang: 'en',
        page: { slug: 'admin-login' },
        seo: { title: 'Admin Login | GANASSA' },
        nav: [],
        settings: {},
        currentSlug: 'admin-login'
    });
});

// ============================
// Dashboard (protected)
// ============================
router.get('/', requireAuth, (req, res) => {
    res.render('admin/dashboard', {
        lang: 'en',
        page: { slug: 'admin' },
        seo: { title: 'Admin Dashboard | GANASSA' },
        nav: [],
        settings: {},
        currentSlug: 'admin',
        user: req.user
    });
});

module.exports = router;