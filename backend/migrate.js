/**
 * migrate.js — Add photo_url column to students table (safe, idempotent)
 * Run once: node migrate.js
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const connection = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || 'root',
    port:     process.env.DB_PORT     || 3306,
    database: process.env.DB_NAME     || 'laxan_dashboard',
  });

  console.log('Running migration: add photo_url to students...');

  try {
    await connection.query(`
      ALTER TABLE students
      ADD COLUMN photo_url VARCHAR(500) NULL DEFAULT NULL;
    `);
    console.log('✅ photo_url column added successfully.');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  photo_url column already exists — skipping.');
    } else {
      throw err;
    }
  }

  await connection.end();
  console.log('Migration complete.');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
