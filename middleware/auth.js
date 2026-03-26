// TODO: Implement
const { verifyToken } = require('../config/auth');

/**
 * Protects admin and API routes.
 * Checks JWT from Authorization header or cookie.
 * - API requests → returns 401 JSON
 * - Admin pages → redirects to login
 */
function requireAuth(req, res, next) {
    let token = null;

    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }

    // 2. Fallback: check cookie
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        if (req.originalUrl.startsWith('/api/')) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        return res.redirect('/admin/login');
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        res.locals.user = decoded;
        next();
    } catch (err) {
        if (req.originalUrl.startsWith('/api/')) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        return res.redirect('/admin/login');
    }
}

module.exports = { requireAuth };