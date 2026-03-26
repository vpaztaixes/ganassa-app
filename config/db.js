// TODO: Implement
const { Pool } = require('pg');

const hasFullPgConfig = [
    process.env.PGHOST,
    process.env.PGPORT,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    process.env.PGDATABASE
].every(Boolean);

const connectionString = process.env.SUPABASE_URL || process.env.DATABASE_URL
    || (hasFullPgConfig
        ? `postgresql://${encodeURIComponent(process.env.PGUSER)}:${encodeURIComponent(process.env.PGPASSWORD)}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
        : '');

if (!connectionString) {
    throw new Error('Database configuration missing. Set DATABASE_URL or PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE');
}

const isSupabaseConnection = /supabase\.com/i.test(connectionString);
const shouldUseSsl = process.env.NODE_ENV === 'production' || isSupabaseConnection;

const pool = new Pool({
    connectionString,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

pool.on('error', (err) => {
    console.error('Unexpected DB pool error:', err);
});

// Run a query, returns full result object
async function query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
        console.log('  DB:', { text: text.substring(0, 80), duration: `${duration}ms`, rows: res.rowCount });
    }
    return res;
}

// Get single row or null
async function getOne(text, params) {
    const res = await query(text, params);
    return res.rows[0] || null;
}

// Get array of rows
async function getMany(text, params) {
    const res = await query(text, params);
    return res.rows;
}

module.exports = { pool, query, getOne, getMany };