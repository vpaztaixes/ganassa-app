// TODO: Implement
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function initDb() {
    console.log('🔧 Initializing database...\n');

    try {
        const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');

        await pool.query(schema);

        console.log('✅ Schema created successfully (12 tables + indexes)\n');
    } catch (err) {
        console.error('❌ Schema error:', err.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

initDb();