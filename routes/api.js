// TODO: Implement
const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { body, param, validationResult } = require('express-validator');
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { generateToken, comparePassword, hashPassword } = require('../config/auth');
const { translateToDefaultTargets } = require('../services/translationService');

// ============================
// MULTER — image uploads
// ============================
const ALLOWED_IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);

const imageStorage = multer.diskStorage({
    destination: path.join(__dirname, '../public/img/uploads'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`);
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ALLOWED_IMAGE_EXTS.has(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (jpg, jpeg, png, gif, webp, svg)'));
        }
    }
});

function validationErrorHandler(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map((err) => ({ field: err.path, message: err.msg }))
    });
}

const loginValidation = [
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password')
        .isString()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters'),
    validationErrorHandler
];

const contactValidation = [
    body('firstName').trim().isLength({ min: 1, max: 100 }).withMessage('First name is required').escape(),
    body('lastName').trim().isLength({ min: 1, max: 100 }).withMessage('Last name is required').escape(),
    body('email').trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('company').trim().isLength({ min: 1, max: 200 }).withMessage('Company is required').escape(),
    body('message').trim().isLength({ min: 20, max: 5000 }).withMessage('Message must be 20-5000 characters'),
    validationErrorHandler
];

const summitValidation = [
    body('firstName').trim().isLength({ min: 1, max: 100 }).withMessage('First name is required').escape(),
    body('lastName').trim().isLength({ min: 1, max: 100 }).withMessage('Last name is required').escape(),
    body('email').trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('company').trim().isLength({ min: 1, max: 200 }).withMessage('Company is required').escape(),
    body('position').trim().isLength({ min: 1, max: 200 }).withMessage('Position is required').escape(),
    body('country').trim().isLength({ min: 1, max: 100 }).withMessage('Country is required').escape(),
    body('ticketType').trim().isLength({ min: 1, max: 50 }).withMessage('Ticket type is required').escape(),
    body('phone').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 50 }).withMessage('Phone is too long').escape(),
    body('specialRequirements')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Special requirements are too long'),
    validationErrorHandler
];

const idParamValidation = [
    param('id').isInt({ min: 1 }).withMessage('Valid id is required'),
    validationErrorHandler
];

const contentBlockValidation = [
    body('pageId').isInt({ min: 1 }).withMessage('pageId must be a positive integer'),
    body('section').trim().isLength({ min: 1, max: 100 }).withMessage('section is required').escape(),
    body('blockKey').trim().isLength({ min: 1, max: 100 }).withMessage('blockKey is required').escape(),
    body('contentEn').trim().isLength({ min: 1 }).withMessage('contentEn is required'),
    body('blockType').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 20 }).withMessage('blockType is too long').escape(),
    body('sortOrder').optional({ nullable: true }).isInt({ min: 0, max: 9999 }).withMessage('sortOrder must be an integer'),
    body('isVisible').optional({ nullable: true }).isBoolean().withMessage('isVisible must be boolean'),
    body('autoTranslate').optional({ nullable: true }).isBoolean().withMessage('autoTranslate must be boolean'),
    body('contentJa').optional({ nullable: true }).isString().withMessage('contentJa must be a string'),
    body('contentKo').optional({ nullable: true }).isString().withMessage('contentKo must be a string'),
    validationErrorHandler
];

const teamValidation = [
    body('name').trim().isLength({ min: 1, max: 100 }).withMessage('name is required'),
    body('positionEn').trim().isLength({ min: 1, max: 200 }).withMessage('positionEn is required'),
    body('positionJa').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 200 }).withMessage('positionJa is too long'),
    body('positionKo').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 200 }).withMessage('positionKo is too long'),
    body('bioEn').optional({ nullable: true, checkFalsy: true }).isLength({ max: 5000 }).withMessage('bioEn is too long'),
    body('bioJa').optional({ nullable: true, checkFalsy: true }).isLength({ max: 5000 }).withMessage('bioJa is too long'),
    body('bioKo').optional({ nullable: true, checkFalsy: true }).isLength({ max: 5000 }).withMessage('bioKo is too long'),
    body('photoUrl').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('photoUrl is too long'),
    body('linkedinUrl').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('linkedinUrl is too long'),
    body('department').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 50 }).withMessage('department is too long'),
    body('fieldPosition').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 50 }).withMessage('fieldPosition is too long'),
    body('sortOrder').optional({ nullable: true }).isInt({ min: 0, max: 9999 }).withMessage('sortOrder must be an integer'),
    body('isVisible').optional({ nullable: true }).isBoolean().withMessage('isVisible must be boolean'),
    validationErrorHandler
];

const testimonialValidation = [
    body('authorName').trim().isLength({ min: 1, max: 100 }).withMessage('authorName is required'),
    body('authorPositionEn').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 200 }).withMessage('authorPositionEn is too long'),
    body('authorPositionJa').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 200 }).withMessage('authorPositionJa is too long'),
    body('authorPositionKo').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 200 }).withMessage('authorPositionKo is too long'),
    body('quoteEn').trim().isLength({ min: 1 }).withMessage('quoteEn is required'),
    body('quoteJa').optional({ nullable: true, checkFalsy: true }).isString(),
    body('quoteKo').optional({ nullable: true, checkFalsy: true }).isString(),
    body('authorAvatarUrl').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 500 }),
    body('teamLogoUrl').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 500 }),
    body('sortOrder').optional({ nullable: true }).isInt({ min: 0, max: 9999 }),
    body('isVisible').optional({ nullable: true }).isBoolean(),
    validationErrorHandler
];

const clientValidation = [
    body('name').trim().isLength({ min: 1, max: 100 }).withMessage('name is required'),
    body('logoUrl').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('logoUrl is too long'),
    body('websiteUrl').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('websiteUrl is too long'),
    body('category').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 50 }).withMessage('category is too long'),
    body('sortOrder').optional({ nullable: true }).isInt({ min: 0, max: 9999 }).withMessage('sortOrder must be an integer'),
    body('isVisible').optional({ nullable: true }).isBoolean().withMessage('isVisible must be boolean'),
    validationErrorHandler
];

const partnerValidation = [
    body('name').trim().isLength({ min: 1, max: 100 }).withMessage('name is required'),
    body('logoUrl').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('logoUrl is too long'),
    body('websiteUrl').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('websiteUrl is too long'),
    body('category').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 50 }).withMessage('category is too long'),
    body('country').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 100 }).withMessage('country is too long'),
    body('descriptionEn').optional({ nullable: true, checkFalsy: true }).isLength({ max: 5000 }).withMessage('descriptionEn is too long'),
    body('descriptionJa').optional({ nullable: true, checkFalsy: true }).isLength({ max: 5000 }).withMessage('descriptionJa is too long'),
    body('descriptionKo').optional({ nullable: true, checkFalsy: true }).isLength({ max: 5000 }).withMessage('descriptionKo is too long'),
    body('sortOrder').optional({ nullable: true }).isInt({ min: 0, max: 9999 }).withMessage('sortOrder must be an integer'),
    body('isVisible').optional({ nullable: true }).isBoolean().withMessage('isVisible must be boolean'),
    validationErrorHandler
];

function parseBool(value, fallback = false) {
    if (value === undefined || value === null || value === '') return fallback;
    if (typeof value === 'boolean') return value;
    return String(value).toLowerCase() === 'true';
}

function parseIntOr(value, fallback = 0) {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}

// ============================
// AUTH
// ============================
router.post('/auth/login', loginValidation, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = await db.getOne('SELECT * FROM admin_users WHERE email = $1', [email]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await comparePassword(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({ id: user.id, email: user.email, name: user.name });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/auth/me', requireAuth, (req, res) => {
    res.json({ user: req.user });
});

// ============================
// IMAGE UPLOAD (admin only)
// ============================
router.post('/admin/upload', requireAuth, (req, res) => {
    imageUpload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 8 MB)' : err.message });
        }
        if (err) {
            return res.status(400).json({ error: err.message || 'Upload failed' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file received' });
        }
        res.json({ url: `/img/uploads/${req.file.filename}` });
    });
});
// ============================
router.post('/contact', contactValidation, async (req, res) => {
    try {
        const { firstName, lastName, email, company, message, mailingListOptIn, teamSupport, countryFrom } = req.body;

        const extraData = {};
        if (mailingListOptIn === true || mailingListOptIn === 'true') {
            extraData.mailingListOptIn = true;
            if (teamSupport) extraData.teamSupport = String(teamSupport).trim().slice(0, 200);
            if (countryFrom) extraData.countryFrom = String(countryFrom).trim().slice(0, 100);
        }

        await db.query(
            `INSERT INTO contact_submissions (first_name, last_name, email, company, message, extra_data, source_page)
             VALUES ($1, $2, $3, $4, $5, $6, 'contact')`,
            [firstName, lastName, email, company, message, JSON.stringify(extraData)]
        );

        res.json({ success: true, message: 'Thank you! Our team will contact you within 24 hours.' });
    } catch (err) {
        console.error('Contact form error:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// ============================
// SUMMIT REGISTRATION (public)
// ============================
router.post('/summit-registration', summitValidation, async (req, res) => {
    try {
        const { firstName, lastName, email, company, position, country, ticketType, phone, specialRequirements } = req.body;

        await db.query(
            `INSERT INTO contact_submissions 
             (first_name, last_name, email, company, position, country, ticket_type, phone, special_requirements, source_page)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'tokyo-summit')`,
            [firstName, lastName, email, company, position, country, ticketType, phone || null, specialRequirements || null]
        );

        res.json({ success: true, message: 'Thank you for your registration! We will contact you within 24 hours.' });
    } catch (err) {
        console.error('Summit registration error:', err);
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// ============================
// ADMIN API (Phase 3 — basic read endpoints)
// ============================
router.get('/admin/pages', requireAuth, async (req, res) => {
    try {
        const pages = await db.getMany('SELECT * FROM pages ORDER BY nav_order');
        res.json(pages);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put(
    '/admin/pages/:id/status',
    requireAuth,
    [
        ...idParamValidation,
        body('status').isIn(['live', 'coming_soon', 'draft']).withMessage('status must be live, coming_soon or draft'),
        validationErrorHandler
    ],
    async (req, res) => {
        try {
            const row = await db.getOne(
                `UPDATE pages
                 SET status = $1
                 WHERE id = $2
                 RETURNING id, slug, status`,
                [req.body.status, req.params.id]
            );

            if (!row) {
                return res.status(404).json({ error: 'Page not found' });
            }

            res.json(row);
        } catch (err) {
            console.error('Update page status error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

router.get('/admin/submissions', requireAuth, async (req, res) => {
    try {
        const source = req.query.source;
        const allowed = ['contact', 'tokyo-summit'];
        let query = 'SELECT * FROM contact_submissions';
        const params = [];
        if (source && allowed.includes(source)) {
            query += ' WHERE source_page = $1';
            params.push(source);
        }
        query += ' ORDER BY created_at DESC LIMIT 500';
        const submissions = await db.getMany(query, params);
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/admin/content-blocks', requireAuth, async (req, res) => {
    try {
        const pageId = Number.parseInt(req.query.pageId, 10);
        if (!Number.isInteger(pageId) || pageId < 1) {
            return res.status(400).json({ error: 'pageId query param is required' });
        }

        const rows = await db.getMany(
            `SELECT id, page_id, section, block_key, block_type, sort_order, is_visible,
                    content_en, content_ja, content_ko
             FROM content_blocks
             WHERE page_id = $1
             ORDER BY section ASC, sort_order ASC, id ASC`,
            [pageId]
        );

        res.json(rows);
    } catch (err) {
        console.error('Get content blocks error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/admin/content-blocks', requireAuth, contentBlockValidation, async (req, res) => {
    try {
        const {
            pageId,
            section,
            blockKey,
            contentEn,
            contentJa,
            contentKo,
            blockType,
            sortOrder,
            isVisible,
            autoTranslate
        } = req.body;

        let finalJa = contentJa || '';
        let finalKo = contentKo || '';
        const shouldAutoTranslate = parseBool(autoTranslate, true);

        if (shouldAutoTranslate && (!finalJa || !finalKo)) {
            try {
                const translated = await translateToDefaultTargets(contentEn, 'en');
                finalJa = finalJa || translated.ja;
                finalKo = finalKo || translated.ko;
            } catch (translationError) {
                console.error('Auto translation failed on create:', translationError.message);
            }
        }

        const created = await db.getOne(
            `INSERT INTO content_blocks
             (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order, is_visible)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [
                pageId,
                section,
                blockKey,
                contentEn,
                finalJa,
                finalKo,
                blockType || 'text',
                parseIntOr(sortOrder, 0),
                parseBool(isVisible, true)
            ]
        );

        res.status(201).json(created);
    } catch (err) {
        if (err && err.code === '23505') {
            return res.status(409).json({ error: 'A block with this page, section and block key already exists' });
        }
        console.error('Create content block error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/admin/content-blocks/:id', requireAuth, [...idParamValidation, ...contentBlockValidation], async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const {
            pageId,
            section,
            blockKey,
            contentEn,
            contentJa,
            contentKo,
            blockType,
            sortOrder,
            isVisible,
            autoTranslate
        } = req.body;

        let finalJa = contentJa || '';
        let finalKo = contentKo || '';
        const shouldAutoTranslate = parseBool(autoTranslate, true);

        if (shouldAutoTranslate && (!finalJa || !finalKo)) {
            try {
                const translated = await translateToDefaultTargets(contentEn, 'en');
                finalJa = finalJa || translated.ja;
                finalKo = finalKo || translated.ko;
            } catch (translationError) {
                console.error('Auto translation failed on update:', translationError.message);
            }
        }

        const updated = await db.getOne(
            `UPDATE content_blocks
             SET page_id = $1,
                 section = $2,
                 block_key = $3,
                 content_en = $4,
                 content_ja = $5,
                 content_ko = $6,
                 block_type = $7,
                 sort_order = $8,
                 is_visible = $9,
                 updated_at = NOW()
             WHERE id = $10
             RETURNING *`,
            [
                pageId,
                section,
                blockKey,
                contentEn,
                finalJa,
                finalKo,
                blockType || 'text',
                parseIntOr(sortOrder, 0),
                parseBool(isVisible, true),
                id
            ]
        );

        if (!updated) {
            return res.status(404).json({ error: 'Content block not found' });
        }

        res.json(updated);
    } catch (err) {
        if (err && err.code === '23505') {
            return res.status(409).json({ error: 'A block with this page, section and block key already exists' });
        }
        console.error('Update content block error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/admin/content-blocks/:id', requireAuth, idParamValidation, async (req, res) => {
    try {
        const deleted = await db.getOne('DELETE FROM content_blocks WHERE id = $1 RETURNING id', [req.params.id]);
        if (!deleted) return res.status(404).json({ error: 'Content block not found' });
        res.json({ success: true });
    } catch (err) {
        console.error('Delete content block error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/admin/team', requireAuth, async (req, res) => {
    try {
        const rows = await db.getMany('SELECT * FROM team_members ORDER BY sort_order ASC, id ASC');
        res.json(rows);
    } catch (err) {
        console.error('Get team error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/admin/team', requireAuth, teamValidation, async (req, res) => {
    try {
        let positionJa = req.body.positionJa || '';
        let positionKo = req.body.positionKo || '';
        let bioJa = req.body.bioJa || '';
        let bioKo = req.body.bioKo || '';

        if (req.body.positionEn && (!positionJa || !positionKo)) {
            try {
                const translated = await translateToDefaultTargets(req.body.positionEn, 'en');
                if (!positionJa) positionJa = translated.ja;
                if (!positionKo) positionKo = translated.ko;
            } catch (translationError) {
                console.error('Auto translation failed (team position):', translationError.message);
            }
        }

        if (req.body.bioEn && (!bioJa || !bioKo)) {
            try {
                const translated = await translateToDefaultTargets(req.body.bioEn, 'en');
                if (!bioJa) bioJa = translated.ja;
                if (!bioKo) bioKo = translated.ko;
            } catch (translationError) {
                console.error('Auto translation failed (team bio):', translationError.message);
            }
        }

        const row = await db.getOne(
            `INSERT INTO team_members
             (name, position_en, position_ja, position_ko, bio_en, bio_ja, bio_ko, photo_url, department, field_position, sort_order, is_visible, linkedin_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             RETURNING *`,
            [
                req.body.name,
                req.body.positionEn,
                positionJa || null,
                positionKo || null,
                req.body.bioEn || null,
                bioJa || null,
                bioKo || null,
                req.body.photoUrl || null,
                req.body.department || null,
                req.body.fieldPosition || null,
                parseIntOr(req.body.sortOrder, 0),
                parseBool(req.body.isVisible, true),
                req.body.linkedinUrl || null
            ]
        );
        res.status(201).json(row);
    } catch (err) {
        console.error('Create team member error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/admin/team/:id', requireAuth, [...idParamValidation, ...teamValidation], async (req, res) => {
    try {
        let positionJa = req.body.positionJa || '';
        let positionKo = req.body.positionKo || '';
        let bioJa = req.body.bioJa || '';
        let bioKo = req.body.bioKo || '';

        if (req.body.positionEn && (!positionJa || !positionKo)) {
            try {
                const translated = await translateToDefaultTargets(req.body.positionEn, 'en');
                if (!positionJa) positionJa = translated.ja;
                if (!positionKo) positionKo = translated.ko;
            } catch (translationError) {
                console.error('Auto translation failed (team position):', translationError.message);
            }
        }

        if (req.body.bioEn && (!bioJa || !bioKo)) {
            try {
                const translated = await translateToDefaultTargets(req.body.bioEn, 'en');
                if (!bioJa) bioJa = translated.ja;
                if (!bioKo) bioKo = translated.ko;
            } catch (translationError) {
                console.error('Auto translation failed (team bio):', translationError.message);
            }
        }

        const row = await db.getOne(
            `UPDATE team_members
             SET name = $1,
                 position_en = $2,
                 position_ja = $3,
                 position_ko = $4,
                 bio_en = $5,
                 bio_ja = $6,
                 bio_ko = $7,
                 photo_url = $8,
                 department = $9,
                 field_position = $10,
                 sort_order = $11,
                 is_visible = $12,
                 linkedin_url = $13,
                 updated_at = NOW()
             WHERE id = $14
             RETURNING *`,
            [
                req.body.name,
                req.body.positionEn,
                positionJa || null,
                positionKo || null,
                req.body.bioEn || null,
                bioJa || null,
                bioKo || null,
                req.body.photoUrl || null,
                req.body.department || null,
                req.body.fieldPosition || null,
                parseIntOr(req.body.sortOrder, 0),
                parseBool(req.body.isVisible, true),
                req.body.linkedinUrl || null,
                req.params.id
            ]
        );

        if (!row) return res.status(404).json({ error: 'Team member not found' });
        res.json(row);
    } catch (err) {
        console.error('Update team member error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/admin/team/:id', requireAuth, idParamValidation, async (req, res) => {
    try {
        const deleted = await db.getOne('DELETE FROM team_members WHERE id = $1 RETURNING id', [req.params.id]);
        if (!deleted) return res.status(404).json({ error: 'Team member not found' });
        await db.query(
            `UPDATE team_members t SET sort_order = sub.rn
             FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY sort_order, id) AS rn FROM team_members) sub
             WHERE t.id = sub.id`
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Delete team member error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/admin/clients', requireAuth, async (req, res) => {
    try {
        const rows = await db.getMany('SELECT * FROM clients ORDER BY sort_order ASC, id ASC');
        res.json(rows);
    } catch (err) {
        console.error('Get clients error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/admin/clients', requireAuth, clientValidation, async (req, res) => {
    try {
        const row = await db.getOne(
            `INSERT INTO clients (name, logo_url, website_url, category, is_visible, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                req.body.name,
                req.body.logoUrl || null,
                req.body.websiteUrl || null,
                req.body.category || null,
                parseBool(req.body.isVisible, true),
                parseIntOr(req.body.sortOrder, 0)
            ]
        );
        res.status(201).json(row);
    } catch (err) {
        console.error('Create client error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/admin/clients/:id', requireAuth, [...idParamValidation, ...clientValidation], async (req, res) => {
    try {
        const row = await db.getOne(
            `UPDATE clients
             SET name = $1,
                 logo_url = $2,
                 website_url = $3,
                 category = $4,
                 is_visible = $5,
                 sort_order = $6
             WHERE id = $7
             RETURNING *`,
            [
                req.body.name,
                req.body.logoUrl || null,
                req.body.websiteUrl || null,
                req.body.category || null,
                parseBool(req.body.isVisible, true),
                parseIntOr(req.body.sortOrder, 0),
                req.params.id
            ]
        );
        if (!row) return res.status(404).json({ error: 'Client not found' });
        res.json(row);
    } catch (err) {
        console.error('Update client error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/admin/clients/:id', requireAuth, idParamValidation, async (req, res) => {
    try {
        const deleted = await db.getOne('DELETE FROM clients WHERE id = $1 RETURNING id', [req.params.id]);
        if (!deleted) return res.status(404).json({ error: 'Client not found' });
        await db.query(
            `UPDATE clients c SET sort_order = sub.rn
             FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY sort_order, id) AS rn FROM clients) sub
             WHERE c.id = sub.id`
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Delete client error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============================
// TESTIMONIALS
// ============================

router.get('/admin/testimonials', requireAuth, async (req, res) => {
    try {
        const rows = await db.getMany('SELECT * FROM testimonials ORDER BY sort_order ASC, id ASC');
        res.json(rows);
    } catch (err) {
        console.error('Get testimonials error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/admin/testimonials', requireAuth, testimonialValidation, async (req, res) => {
    try {
        const row = await db.getOne(
            `INSERT INTO testimonials
             (author_name, author_position_en, author_position_ja, author_position_ko,
              author_avatar_url, team_logo_url, quote_en, quote_ja, quote_ko, is_visible, sort_order)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [
                req.body.authorName,
                req.body.authorPositionEn || '',
                req.body.authorPositionJa || '',
                req.body.authorPositionKo || '',
                req.body.authorAvatarUrl || null,
                req.body.teamLogoUrl || null,
                req.body.quoteEn,
                req.body.quoteJa || '',
                req.body.quoteKo || '',
                parseBool(req.body.isVisible, true),
                parseIntOr(req.body.sortOrder, 0)
            ]
        );
        res.status(201).json(row);
    } catch (err) {
        console.error('Create testimonial error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/admin/testimonials/:id', requireAuth, [...idParamValidation, ...testimonialValidation], async (req, res) => {
    try {
        const row = await db.getOne(
            `UPDATE testimonials SET
                author_name=$1, author_position_en=$2, author_position_ja=$3, author_position_ko=$4,
                author_avatar_url=$5, team_logo_url=$6,
                quote_en=$7, quote_ja=$8, quote_ko=$9,
                is_visible=$10, sort_order=$11
             WHERE id=$12 RETURNING *`,
            [
                req.body.authorName,
                req.body.authorPositionEn || '',
                req.body.authorPositionJa || '',
                req.body.authorPositionKo || '',
                req.body.authorAvatarUrl || null,
                req.body.teamLogoUrl || null,
                req.body.quoteEn,
                req.body.quoteJa || '',
                req.body.quoteKo || '',
                parseBool(req.body.isVisible, true),
                parseIntOr(req.body.sortOrder, 0),
                req.params.id
            ]
        );
        if (!row) return res.status(404).json({ error: 'Testimonial not found' });
        res.json(row);
    } catch (err) {
        console.error('Update testimonial error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/admin/testimonials/:id', requireAuth, idParamValidation, async (req, res) => {
    try {
        const deleted = await db.getOne('DELETE FROM testimonials WHERE id = $1 RETURNING id', [req.params.id]);
        if (!deleted) return res.status(404).json({ error: 'Testimonial not found' });
        await db.query(
            `UPDATE testimonials t SET sort_order = sub.rn
             FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY sort_order, id) AS rn FROM testimonials) sub
             WHERE t.id = sub.id`
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Delete testimonial error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/admin/partners', requireAuth, async (req, res) => {
    try {
        const rows = await db.getMany('SELECT * FROM partners ORDER BY sort_order ASC, id ASC');
        res.json(rows);
    } catch (err) {
        console.error('Get partners error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/admin/partners', requireAuth, partnerValidation, async (req, res) => {
    try {
        const row = await db.getOne(
            `INSERT INTO partners
             (name, logo_url, website_url, category, description_en, description_ja, description_ko, country, is_visible, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [
                req.body.name,
                req.body.logoUrl || null,
                req.body.websiteUrl || null,
                req.body.category || null,
                req.body.descriptionEn || null,
                req.body.descriptionJa || null,
                req.body.descriptionKo || null,
                req.body.country || null,
                parseBool(req.body.isVisible, true),
                parseIntOr(req.body.sortOrder, 0)
            ]
        );
        res.status(201).json(row);
    } catch (err) {
        console.error('Create partner error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/admin/partners/:id', requireAuth, [...idParamValidation, ...partnerValidation], async (req, res) => {
    try {
        const row = await db.getOne(
            `UPDATE partners
             SET name = $1,
                 logo_url = $2,
                 website_url = $3,
                 category = $4,
                 description_en = $5,
                 description_ja = $6,
                 description_ko = $7,
                 country = $8,
                 is_visible = $9,
                 sort_order = $10
             WHERE id = $11
             RETURNING *`,
            [
                req.body.name,
                req.body.logoUrl || null,
                req.body.websiteUrl || null,
                req.body.category || null,
                req.body.descriptionEn || null,
                req.body.descriptionJa || null,
                req.body.descriptionKo || null,
                req.body.country || null,
                parseBool(req.body.isVisible, true),
                parseIntOr(req.body.sortOrder, 0),
                req.params.id
            ]
        );
        if (!row) return res.status(404).json({ error: 'Partner not found' });
        res.json(row);
    } catch (err) {
        console.error('Update partner error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/admin/partners/:id', requireAuth, idParamValidation, async (req, res) => {
    try {
        const deleted = await db.getOne('DELETE FROM partners WHERE id = $1 RETURNING id', [req.params.id]);
        if (!deleted) return res.status(404).json({ error: 'Partner not found' });
        res.json({ success: true });
    } catch (err) {
        console.error('Delete partner error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============================
// SERVICES (image management)
// ============================
router.get('/admin/services', requireAuth, async (req, res) => {
    try {
        const rows = await db.getMany('SELECT * FROM services ORDER BY sort_order ASC, id ASC');
        res.json(rows);
    } catch (err) {
        console.error('Get services error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/admin/services/:id', requireAuth, idParamValidation, async (req, res) => {
    try {
        const current = await db.getOne('SELECT * FROM services WHERE id = $1', [req.params.id]);
        if (!current) return res.status(404).json({ error: 'Service not found' });

        const titleEn = req.body.titleEn !== undefined ? (String(req.body.titleEn || '').trim() || current.title_en) : current.title_en;
        const subtitleEn = req.body.subtitleEn !== undefined ? (String(req.body.subtitleEn || '').trim() || null) : current.subtitle_en;
        const descriptionEn = req.body.descriptionEn !== undefined ? (String(req.body.descriptionEn || '').trim() || null) : current.description_en;
        const imageUrl = req.body.imageUrl !== undefined ? (String(req.body.imageUrl || '').trim() || null) : current.image_url;
        const isVisible = req.body.isVisible !== undefined ? parseBool(req.body.isVisible, true) : current.is_visible;
        const sortOrder = req.body.sortOrder !== undefined ? parseIntOr(req.body.sortOrder, current.sort_order) : current.sort_order;

        let titleJa = req.body.titleJa !== undefined ? (req.body.titleJa || null) : current.title_ja;
        let titleKo = req.body.titleKo !== undefined ? (req.body.titleKo || null) : current.title_ko;
        let subtitleJa = current.subtitle_ja;
        let subtitleKo = current.subtitle_ko;

        const titleChanged = titleEn !== current.title_en;
        const subtitleChanged = subtitleEn !== current.subtitle_en;

        if (titleChanged && (!titleJa || !titleKo)) {
            try {
                const t = await translateToDefaultTargets(titleEn, 'en');
                if (!titleJa) titleJa = t.ja;
                if (!titleKo) titleKo = t.ko;
            } catch (e) { console.error('Auto-translate service title:', e.message); }
        }
        if (subtitleEn && subtitleChanged) {
            try {
                const t = await translateToDefaultTargets(subtitleEn, 'en');
                subtitleJa = t.ja;
                subtitleKo = t.ko;
            } catch (e) { console.error('Auto-translate service subtitle:', e.message); }
        }

        const row = await db.getOne(
            `UPDATE services SET
             title_en = $1, title_ja = $2, title_ko = $3,
             subtitle_en = $4, subtitle_ja = $5, subtitle_ko = $6,
             description_en = $7,
             image_url = $8,
             is_visible = $9,
             sort_order = $10,
             updated_at = NOW()
             WHERE id = $11
             RETURNING *`,
            [titleEn, titleJa, titleKo, subtitleEn, subtitleJa, subtitleKo, descriptionEn, imageUrl, isVisible, sortOrder, req.params.id]
        );
        if (!row) return res.status(404).json({ error: 'Service not found' });
        res.json(row);
    } catch (err) {
        console.error('Update service error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============================
// SITE SETTINGS
// ============================
const EDITABLE_SETTINGS = new Set([
    'contact_email', 'social_linkedin', 'social_twitter', 'social_instagram',
    'office_japan', 'office_singapore', 'office_china', 'office_spain',
    'footer_copyright', 'site_name', 'site_slogan', 'summit_form_enabled',
    // Contact form texts
    'contact_form_title', 'contact_form_description', 'contact_form_submit_btn', 'contact_form_footer_note',
    // Tokyo Summit registration form texts
    'summit_reg_title', 'summit_reg_description', 'summit_reg_submit_btn'
]);

// ============================
// CHANGE PASSWORD
// ============================
router.put(
    '/admin/change-password',
    requireAuth,
    [
        body('currentPassword').isString().isLength({ min: 1, max: 128 }).withMessage('Current password is required'),
        body('newPassword').isString().isLength({ min: 8, max: 128 }).withMessage('New password must be at least 8 characters'),
        validationErrorHandler
    ],
    async (req, res) => {
        try {
            const user = await db.getOne('SELECT * FROM admin_users WHERE id = $1', [req.user.id]);
            if (!user) return res.status(404).json({ error: 'User not found' });

            const valid = await comparePassword(req.body.currentPassword, user.password_hash);
            if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });

            const newHash = await hashPassword(req.body.newPassword);
            await db.query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [newHash, req.user.id]);

            res.json({ success: true });
        } catch (err) {
            console.error('Change password error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

router.get('/admin/settings', requireAuth, async (req, res) => {
    try {
        const rows = await db.getMany('SELECT key, value_en FROM site_settings ORDER BY key ASC');
        res.json(rows);
    } catch (err) {
        console.error('Get settings error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put(
    '/admin/settings/:key',
    requireAuth,
    [
        param('key').matches(/^[a-z0-9_]+$/).withMessage('Invalid settings key'),
        body('value').isString().withMessage('value is required').isLength({ max: 2000 }).withMessage('value too long'),
        validationErrorHandler
    ],
    async (req, res) => {
        try {
            const key = req.params.key;

            if (!EDITABLE_SETTINGS.has(key)) {
                return res.status(400).json({ error: 'Invalid settings key' });
            }

            const value = String(req.body.value || '').trim();

            // Language-agnostic keys: sync all language columns so JA/KO pages also see the change
            const LANG_AGNOSTIC = new Set(['summit_form_enabled']);
            const syncAllLangs = LANG_AGNOSTIC.has(key);

            const row = await db.getOne(
                syncAllLangs
                    ? `INSERT INTO site_settings (key, value_en, value_ja, value_ko) VALUES ($2, $1, $1, $1)
                       ON CONFLICT (key) DO UPDATE SET value_en = $1, value_ja = $1, value_ko = $1, updated_at = NOW()
                       RETURNING key, value_en`
                    : `INSERT INTO site_settings (key, value_en) VALUES ($2, $1)
                       ON CONFLICT (key) DO UPDATE SET value_en = $1, updated_at = NOW()
                       RETURNING key, value_en`,
                [value, key]
            );

            res.json(row);
        } catch (err) {
            console.error('Update setting error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// ============================
// BULK TRANSLATE (admin)
// ============================
router.post('/admin/translate-all', requireAuth, async (req, res) => {
    try {
        const force = req.body.force !== false; // default true — retranslate everything
        const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
        if (!apiKey) {
            return res.status(400).json({ error: 'GOOGLE_TRANSLATE_API_KEY is not configured. Add it to your .env file.' });
        }

        const results = { content_blocks: 0, team: 0, faq: 0, testimonials: 0, failed: 0 };

        // --- 1. Content blocks ---
        const blockFilter = force
            ? `WHERE content_en IS NOT NULL AND content_en != ''`
            : `WHERE content_en IS NOT NULL AND content_en != '' AND (content_ja IS NULL OR content_ja = '' OR content_ko IS NULL OR content_ko = '')`;

        const blocks = await db.getMany(`SELECT id, content_en FROM content_blocks ${blockFilter}`);

        for (const block of blocks) {
            try {
                const { ja, ko } = await translateToDefaultTargets(block.content_en);
                await db.query(
                    'UPDATE content_blocks SET content_ja = $1, content_ko = $2 WHERE id = $3',
                    [ja, ko, block.id]
                );
                results.content_blocks++;
            } catch (e) { results.failed++; }
        }

        // --- 2. Team members (positions + bios) ---
        const teamFilter = force
            ? `WHERE position_en IS NOT NULL AND position_en != ''`
            : `WHERE position_en IS NOT NULL AND position_en != '' AND (position_ja IS NULL OR position_ja = '' OR position_ko IS NULL OR position_ko = '')`;

        const members = await db.getMany(`SELECT id, position_en, bio_en FROM team_members ${teamFilter}`);

        for (const m of members) {
            try {
                const pos = await translateToDefaultTargets(m.position_en);
                const bio = m.bio_en ? await translateToDefaultTargets(m.bio_en) : { ja: '', ko: '' };
                await db.query(
                    'UPDATE team_members SET position_ja = $1, position_ko = $2, bio_ja = $3, bio_ko = $4 WHERE id = $5',
                    [pos.ja, pos.ko, bio.ja, bio.ko, m.id]
                );
                results.team++;
            } catch (e) { results.failed++; }
        }

        // --- 3. FAQ items ---
        const faqFilter = force
            ? `WHERE question_en IS NOT NULL AND question_en != ''`
            : `WHERE question_en IS NOT NULL AND question_en != '' AND (question_ja IS NULL OR question_ja = '' OR question_ko IS NULL OR question_ko = '')`;

        const faqs = await db.getMany(`SELECT id, question_en, answer_en, category_en FROM faq_items ${faqFilter}`).catch(() => []);

        for (const f of faqs) {
            try {
                const q = await translateToDefaultTargets(f.question_en);
                const a = f.answer_en ? await translateToDefaultTargets(f.answer_en) : { ja: '', ko: '' };
                const cat = f.category_en ? await translateToDefaultTargets(f.category_en) : { ja: '', ko: '' };
                await db.query(
                    'UPDATE faq_items SET question_ja = $1, question_ko = $2, answer_ja = $3, answer_ko = $4, category_ja = $5, category_ko = $6 WHERE id = $7',
                    [q.ja, q.ko, a.ja, a.ko, cat.ja, cat.ko, f.id]
                );
                results.faq++;
            } catch (e) { results.failed++; }
        }

        // --- 4. Testimonials (positions + quotes) ---
        const testimonialFilter = force
            ? `WHERE quote_en IS NOT NULL AND quote_en != ''`
            : `WHERE quote_en IS NOT NULL AND quote_en != '' AND (quote_ja IS NULL OR quote_ja = '' OR quote_ko IS NULL OR quote_ko = '')`;

        const testimonialRows = await db.getMany(`SELECT id, author_position_en, quote_en FROM testimonials ${testimonialFilter}`);

        for (const t of testimonialRows) {
            try {
                const quote = await translateToDefaultTargets(t.quote_en);
                const pos = t.author_position_en ? await translateToDefaultTargets(t.author_position_en) : { ja: '', ko: '' };
                await db.query(
                    'UPDATE testimonials SET quote_ja = $1, quote_ko = $2, author_position_ja = $3, author_position_ko = $4 WHERE id = $5',
                    [quote.ja, quote.ko, pos.ja, pos.ko, t.id]
                );
                results.testimonials++;
            } catch (e) { results.failed++; }
        }

        const total = results.content_blocks + results.team + results.faq + results.testimonials;
        res.json({ success: true, total, results });
    } catch (err) {
        console.error('Translate all error:', err);
        res.status(500).json({ error: err.message || 'Server error' });
    }
});

// ============================
// FORM FIELDS (admin)
// ============================
const formFieldValidation = [
    body('formId').trim().isIn(['contact', 'summit']).withMessage('formId must be contact or summit'),
    body('fieldType').trim().isIn(['text', 'email', 'tel', 'select', 'textarea', 'number']).withMessage('Invalid fieldType'),
    body('fieldName').trim().matches(/^[a-zA-Z][a-zA-Z0-9_]{0,99}$/).withMessage('fieldName must be alphanumeric starting with a letter'),
    body('labelEn').trim().isLength({ min: 1, max: 200 }).withMessage('labelEn is required'),
    body('placeholderEn').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 200 }),
    body('isRequired').optional({ nullable: true }).isBoolean(),
    body('isVisible').optional({ nullable: true }).isBoolean(),
    body('sortOrder').optional({ nullable: true }).isInt({ min: 0, max: 9999 }),
    body('optionsJson').optional({ nullable: true }).isArray().withMessage('optionsJson must be an array'),
    validationErrorHandler
];

router.get('/admin/form-fields', requireAuth, async (req, res) => {
    try {
        const { formId } = req.query;
        if (!formId || !['contact', 'summit'].includes(formId)) {
            return res.status(400).json({ error: 'formId query param must be contact or summit' });
        }
        const rows = await db.getMany(
            `SELECT id, form_id, field_type, field_name, label_en, placeholder_en,
                    is_required, is_visible, is_core, sort_order, options_json
             FROM form_fields
             WHERE form_id = $1
             ORDER BY sort_order ASC, id ASC`,
            [formId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Get form fields error:', err);
        res.status(500).json({ error: err.message || 'Server error' });
    }
});

router.post('/admin/form-fields', requireAuth, formFieldValidation, async (req, res) => {
    try {
        const { formId, fieldType, fieldName, labelEn, placeholderEn, isRequired, isVisible, sortOrder, optionsJson } = req.body;
        const row = await db.getOne(
            `INSERT INTO form_fields (form_id, field_type, field_name, label_en, placeholder_en, is_required, is_visible, is_core, sort_order, options_json)
             VALUES ($1, $2, $3, $4, $5, $6, $7, false, $8, $9)
             RETURNING *`,
            [
                formId, fieldType, fieldName, labelEn,
                placeholderEn || '',
                parseBool(isRequired, false),
                parseBool(isVisible, true),
                parseIntOr(sortOrder, 100),
                optionsJson ? JSON.stringify(optionsJson) : null
            ]
        );
        res.status(201).json(row);
    } catch (err) {
        if (err && err.code === '23505') {
            return res.status(409).json({ error: 'A field with that name already exists on this form' });
        }
        console.error('Create form field error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put(
    '/admin/form-fields/:id',
    requireAuth,
    [
        ...idParamValidation,
        body('labelEn').trim().isLength({ min: 1, max: 200 }).withMessage('labelEn is required'),
        body('placeholderEn').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 200 }),
        body('isRequired').optional({ nullable: true }).isBoolean(),
        body('isVisible').optional({ nullable: true }).isBoolean(),
        body('sortOrder').optional({ nullable: true }).isInt({ min: 0, max: 9999 }),
        body('optionsJson').optional({ nullable: true }).isArray().withMessage('optionsJson must be an array'),
        validationErrorHandler
    ],
    async (req, res) => {
        try {
            const { labelEn, placeholderEn, isRequired, isVisible, sortOrder, optionsJson } = req.body;
            const row = await db.getOne(
                `UPDATE form_fields
                 SET label_en = $1, placeholder_en = $2, is_required = $3, is_visible = $4,
                     sort_order = $5, options_json = $6, updated_at = NOW()
                 WHERE id = $7
                 RETURNING *`,
                [
                    labelEn,
                    placeholderEn || '',
                    parseBool(isRequired, false),
                    parseBool(isVisible, true),
                    parseIntOr(sortOrder, 100),
                    optionsJson ? JSON.stringify(optionsJson) : null,
                    req.params.id
                ]
            );
            if (!row) return res.status(404).json({ error: 'Form field not found' });
            res.json(row);
        } catch (err) {
            console.error('Update form field error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

router.delete('/admin/form-fields/:id', requireAuth, idParamValidation, async (req, res) => {
    try {
        const field = await db.getOne('SELECT id, is_core FROM form_fields WHERE id = $1', [req.params.id]);
        if (!field) return res.status(404).json({ error: 'Form field not found' });
        if (field.is_core) return res.status(400).json({ error: 'Core fields cannot be deleted' });
        await db.query('DELETE FROM form_fields WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Delete form field error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;