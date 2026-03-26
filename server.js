// TODO: Implement
require('dotenv').config();
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const publicRoutes = require('./routes/public');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');
const seoRoutes = require('./routes/seo');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

// ======================
// MIDDLEWARE
// ======================
app.use(compression());
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

// ======================
// STATIC FILES
// ======================
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '7d' : '0'
}));

// ======================
// VIEW ENGINE
// ======================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ======================
// GLOBAL TEMPLATE VARS
// ======================
app.use((req, res, next) => {
    res.locals.baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    res.locals.currentYear = new Date().getFullYear();
    next();
});

// ======================
// ROUTES
// ======================

// SEO files (sitemap.xml, robots.txt)
app.use(seoRoutes);

// API routes
app.use('/api', apiLimiter, apiRoutes);

// Admin panel
app.use('/admin', adminRoutes);

// Root redirect → /en/
app.get('/', (req, res) => {
    res.redirect(301, '/en/');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Public pages (must be last — catches /:lang/*)
app.use(publicRoutes);

// ======================
// 404
// ======================
app.use((req, res) => {
    res.status(404).render('pages/404', {
        lang: 'en',
        page: { slug: '404' },
        seo: { title: '404 - Page Not Found | GANASSA' },
        nav: [],
        settings: {},
        currentSlug: '404'
    });
});

// ======================
// ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).render('pages/404', {
        lang: 'en',
        page: { slug: 'error' },
        seo: { title: 'Error | GANASSA' },
        nav: [],
        settings: {},
        currentSlug: 'error'
    });
});

// ======================
// START
// ======================
app.listen(PORT, () => {
    console.log(`\n GANASSA server running on port ${PORT}`);
    console.log(`   http://localhost:${PORT}\n`);
});

module.exports = app;