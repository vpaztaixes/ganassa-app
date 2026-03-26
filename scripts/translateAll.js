// Load .env.docker if available (local), otherwise env vars come from Docker
const path = require('path');
const envFile = require('fs').existsSync(path.join(__dirname, '../.env.docker'))
    ? path.join(__dirname, '../.env.docker')
    : path.join(__dirname, '../.env');
require('dotenv').config({ path: envFile });

const { pool, getMany, query } = require('../config/db');
const { translateToDefaultTargets } = require('../services/translationService');

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateContentBlocks() {
    const rows = await getMany(
        `SELECT id, content_en, content_ja, content_ko FROM content_blocks
         WHERE content_en IS NOT NULL AND content_en != ''
           AND content_en !~ '\\.(jpg|jpeg|png|gif|webp|svg)(\\?|$)'
           AND (
             (content_ja IS NULL OR content_ja = '' OR content_ja = content_en)
             OR
             (content_ko IS NULL OR content_ko = '' OR content_ko = content_en)
           )
         ORDER BY id ASC`
    );

    console.log(`Content blocks to translate: ${rows.length}`);

    for (const row of rows) {
        if (!row.content_en || row.content_en.trim() === '') continue;
        try {
            const translated = await translateToDefaultTargets(row.content_en, 'en');
            const newJa = (!row.content_ja || row.content_ja === '') ? translated.ja : row.content_ja;
            const newKo = (!row.content_ko || row.content_ko === '') ? translated.ko : row.content_ko;
            await query(
                `UPDATE content_blocks SET content_ja = $1, content_ko = $2 WHERE id = $3`,
                [newJa, newKo, row.id]
            );
            console.log(`  [block ${row.id}] OK`);
            await sleep(100);
        } catch (err) {
            console.error(`  [block ${row.id}] ERROR: ${err.message}`);
        }
    }
}

async function translateTeamMembers() {
    const rows = await getMany(
        `SELECT id, position_en, position_ja, position_ko, bio_en, bio_ja, bio_ko FROM team_members
         WHERE (position_ja IS NULL OR position_ja = '')
            OR (position_ko IS NULL OR position_ko = '')
            OR (bio_en IS NOT NULL AND bio_en != '' AND (bio_ja IS NULL OR bio_ja = ''))
            OR (bio_en IS NOT NULL AND bio_en != '' AND (bio_ko IS NULL OR bio_ko = ''))
         ORDER BY id ASC`
    );

    console.log(`Team members to translate: ${rows.length}`);

    for (const row of rows) {
        try {
            let posJa = row.position_ja || '';
            let posKo = row.position_ko || '';
            let bioJa = row.bio_ja || '';
            let bioKo = row.bio_ko || '';

            if (row.position_en && (!posJa || !posKo)) {
                const t = await translateToDefaultTargets(row.position_en, 'en');
                if (!posJa) posJa = t.ja;
                if (!posKo) posKo = t.ko;
                await sleep(100);
            }

            if (row.bio_en && (!bioJa || !bioKo)) {
                const t = await translateToDefaultTargets(row.bio_en, 'en');
                if (!bioJa) bioJa = t.ja;
                if (!bioKo) bioKo = t.ko;
                await sleep(100);
            }

            await query(
                `UPDATE team_members SET position_ja = $1, position_ko = $2, bio_ja = $3, bio_ko = $4 WHERE id = $5`,
                [posJa || null, posKo || null, bioJa || null, bioKo || null, row.id]
            );
            console.log(`  [team ${row.id}] OK`);
        } catch (err) {
            console.error(`  [team ${row.id}] ERROR: ${err.message}`);
        }
    }
}

async function main() {
    console.log('=== Translating all existing content ===\n');

    if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
        console.error('ERROR: GOOGLE_TRANSLATE_API_KEY not set in .env');
        process.exit(1);
    }

    console.log('--- Content Blocks ---');
    await translateContentBlocks();

    console.log('\n--- Team Members ---');
    await translateTeamMembers();

    console.log('\nDone!');
    await pool.end();
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
