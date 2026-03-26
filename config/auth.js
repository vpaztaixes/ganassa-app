const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || (isProduction ? null : 'dev-secret-change-me');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const SALT_ROUNDS = 12;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required in production');
}

if (isProduction && JWT_SECRET === 'dev-secret-change-me') {
    throw new Error('JWT_SECRET cannot use the development default in production');
}

function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

module.exports = { generateToken, verifyToken, hashPassword, comparePassword };