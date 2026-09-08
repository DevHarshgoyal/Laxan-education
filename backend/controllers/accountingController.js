const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const queries = require('../models/queries');
const { logger } = require('../middleware/logger');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const { parseReportDate } = require('../utils/dateUtils');

// ── Ensure Users Table Exists and Seed Default Static Users ─────────
async function ensureUsersTableAndSeed() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE,
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [existing] = await pool.query('SELECT COUNT(*) as count FROM users');
    if (existing[0]?.count === 0) {
      logger.info('Seeding institutional accounts into users table with encrypted credentials...');
      const seedUsers = [
        { username: 'admin1', email: 'admin1@laxan.com', pass: 'laxanadmin1@2026India', role: 'admin' },
        { username: 'accountant1', email: 'accountant1@laxan.com', pass: 'laxanaccountant1@2026India', role: 'accountant' },
        { username: 'admin2', email: 'admin2@laxan.com', pass: 'laxanadmin2@2026India', role: 'admin' },
        { username: 'accountant2', email: 'accountant2@laxan.com', pass: 'laxanaccountant2@2026India', role: 'accountant' }
      ];

      for (const u of seedUsers) {
        const hash = await bcrypt.hash(u.pass, 10);
        await pool.query(
          'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
          [u.username, u.email, hash, u.role]
        );
      }
      logger.info('Institutional user accounts verified and secured in database.');
    }
  } catch (err) {
    logger.error('Error verifying/seeding users table:', err);
  }
}

// Run user verification on startup
ensureUsersTableAndSeed();

// ── Authentication Controller ────────────────────────────────────────

/**
 * POST /api/accounting/login
 * Body: { username, password }
 * Validates credentials via bcrypt and issues signed JWT access token
 */
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    logger.warn(`[accounting.login] Missing credentials in login request from IP: ${req.ip}`);
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const [rows] = await pool.query(queries.findUser, [username.trim(), username.trim()]);
    if (rows.length === 0) {
      logger.warn(`[accounting.login] Login rejected: user "${username.trim()}" not found from IP: ${req.ip}`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = rows[0];

    // Strictly enforce bcrypt hash validation (No plaintext fallback)
    if (!user.password || !user.password.startsWith('$2')) {
      logger.warn(`[accounting.login] User "${username.trim()}" has invalid/legacy password hash format`);
      return res.status(401).json({ error: 'Invalid credentials format. Please contact administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`[accounting.login] Login rejected: incorrect password for user "${username.trim()}" from IP: ${req.ip}`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Sign secure JWT access token valid for 8 hours
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    logger.info(`[accounting.login] User "${user.username}" (${user.role}) logged in successfully from IP: ${req.ip}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    logger.error(`[accounting.login] Error authenticating user "${username}":`, err);
    res.status(500).json({ error: 'Database error during authentication' });
  }
};

// ── Institutional Reports Controllers ────────────────────────────────

/**
 * GET /api/accounting/reports/remaining-fees
 * Query: { from, to, search }
 * Returns remaining fees by next due date range matching Image 1
 */
const getRemainingFeesReport = async (req, res) => {
  const { from, to, search } = req.query;
  try {
    const fromDate = parseReportDate(from);
    const toDate = parseReportDate(to);

    let sql = queries.getRemainingFeesReport;
    const params = [];

    if (fromDate) {
      sql += ' AND d.nextduedate >= ?';
      params.push(fromDate);
    }
    if (toDate) {
      sql += ' AND d.nextduedate <= ?';
      params.push(toDate);
    }
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      sql += ' AND (m.name LIKE ? OR d.mid LIKE ?)';
      params.push(term, term);
    }

    sql += ' ORDER BY d.nextduedate ASC, d.id ASC';

    const [rows] = await pool.query(sql, params);
    const totalRemainFee = rows.reduce((sum, r) => sum + (parseFloat(r.remainFee) || 0), 0);

    logger.info(`[accounting.reports] Remaining fees loaded: ${rows.length} records (range: ${fromDate || 'all'} to ${toDate || 'all'}) by ${req.user?.username || 'unknown'}`);

    res.json({
      success: true,
      reportTitle: 'Remaning Fee Report',
      filter: { from: fromDate || null, to: toDate || null },
      data: rows.map(r => ({
        id: r.id,
        memberid: r.memberid,
        name: r.name,
        course: r.course,
        remainFee: parseFloat(r.remainFee) || 0,
        nextDueDate: r.nextDueDate,
        status: r.status,
        usr: r.usr
      })),
      totalRemainFee,
      count: rows.length
    });
  } catch (err) {
    logger.error('[accounting.getRemainingFeesReport] Query execution error:', err);
    res.status(500).json({ error: 'Database error loading remaining fee report' });
  }
};

/**
 * GET /api/accounting/reports/day-wise-collection
 * Query: { from, to, pmode, search }
 * Returns day-wise collection report matching Image 2
 */
const getDayWiseCollectionReport = async (req, res) => {
  const { from, to, pmode, search } = req.query;
  try {
    const fromDate = parseReportDate(from);
    const toDate = parseReportDate(to);

    let sql = queries.getDayWiseCollectionReport;
    const params = [];

    if (fromDate) {
      sql += ' AND feesdate >= ?';
      params.push(fromDate);
    }
    if (toDate) {
      sql += ' AND feesdate <= ?';
      params.push(toDate);
    }
    if (pmode && pmode !== 'ALL') {
      sql += ' AND LOWER(pmode) = LOWER(?)';
      params.push(pmode);
    }
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      sql += ' AND (recno LIKE ? OR name LIKE ? OR CAST(memberid AS CHAR) LIKE ?)';
      params.push(term, term, term);
    }

    sql += ' ORDER BY feesdate ASC, id ASC';

    const [rows] = await pool.query(sql, params);

    let totalAmount = 0;
    let cashAmount = 0;
    let bankAmount = 0;
    let otherAmount = 0;

    rows.forEach(r => {
      const amt = parseFloat(r.amount) || 0;
      totalAmount += amt;
      const mode = (r.pmode || '').toLowerCase();
      if (mode === 'cash') {
        cashAmount += amt;
      } else if (mode === 'bank') {
        bankAmount += amt;
      } else {
        otherAmount += amt;
      }
    });

    logger.info(`[accounting.reports] Day-wise collection loaded: ${rows.length} receipts (total: ₹${totalAmount}) by ${req.user?.username || 'unknown'}`);

    res.json({
      success: true,
      reportTitle: 'Day Wise Collection Report',
      filter: { from: fromDate || null, to: toDate || null },
      data: rows.map(r => ({
        id: r.id,
        memberid: r.memberid,
        date: r.date,
        recno: r.recno,
        name: r.name,
        pmode: r.pmode || 'Other',
        amount: parseFloat(r.amount) || 0
      })),
      totalAmount,
      cashAmount,
      bankAmount,
      otherAmount,
      count: rows.length
    });
  } catch (err) {
    logger.error('[accounting.getDayWiseCollectionReport] Query execution error:', err);
    res.status(500).json({ error: 'Database error loading day-wise collection report' });
  }
};

/**
 * GET /api/accounting/reports/student-list
 * Query: { from, to, course, search }
 * Returns student list / admission report matching Image 3
 */
const getStudentListReport = async (req, res) => {
  const { from, to, course, search } = req.query;
  try {
    const fromDate = parseReportDate(from);
    const toDate = parseReportDate(to);

    let sql = queries.getStudentListReport;
    const params = [];

    if (fromDate) {
      sql += ' AND startdate >= ?';
      params.push(fromDate);
    }
    if (toDate) {
      sql += ' AND startdate <= ?';
      params.push(toDate);
    }
    if (course && course !== 'ALL') {
      sql += ' AND LOWER(course) = LOWER(?)';
      params.push(course);
    }
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      sql += ' AND (name LIKE ? OR memberid LIKE ? OR course LIKE ?)';
      params.push(term, term, term);
    }

    sql += ' ORDER BY CAST(memberid AS UNSIGNED) ASC, id ASC';

    const [rows] = await pool.query(sql, params);
    const totalFinalFee = rows.reduce((sum, r) => sum + (parseFloat(r.finalFee) || 0), 0);

    logger.info(`[accounting.reports] Student list loaded: ${rows.length} admissions by ${req.user?.username || 'unknown'}`);

    res.json({
      success: true,
      reportTitle: 'Student List',
      filter: { from: fromDate || null, to: toDate || null },
      data: rows.map(r => ({
        id: r.memberid || r.id,
        memberid: r.memberid,
        date: r.date,
        name: r.name,
        course: r.course || 'COMBO',
        finalFee: parseFloat(r.finalFee) || 0
      })),
      totalAdmissions: rows.length,
      totalFinalFee
    });
  } catch (err) {
    logger.error('[accounting.getStudentListReport] Query execution error:', err);
    res.status(500).json({ error: 'Database error loading student list report' });
  }
};

module.exports = {
  login,
  getRemainingFeesReport,
  getDayWiseCollectionReport,
  getStudentListReport
};
