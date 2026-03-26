// TODO: Implement
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function seed() {
    console.log('🌱 Seeding database...\n');

    try {
        const seedPath = path.join(__dirname, '..', 'db', 'seed.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf-8');

        await pool.query(seedSql);

        console.log('✅ Seed data inserted successfully');
        console.log('   - 1 admin user (admin@ganassa.jp / ganassa2026)');
        console.log('   - 7 pages');
        console.log('   - 21 SEO metadata entries');
        console.log('   - 40+ content blocks');
        console.log('   - 12 team members');
        console.log('   - 21 clients');
        console.log('   - 13 partners');
        console.log('   - 6 services');
        console.log('   - 4 FAQ items');
        console.log('   - 11 site settings\n');
    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

seed();