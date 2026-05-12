const pool = require('../config/db');
const queries = require('../models/queries');

const getProfile = async (req, res) => {
  const { student_id } = req.query;
  if (!student_id) return res.status(400).json({ error: 'student_id is required' });
  try {
    const [rows] = await pool.query(queries.getProfile, [student_id]);
    res.json(rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getAttendanceMetrics = async (req, res) => {
  const { member_id } = req.query;
  if (!member_id) return res.status(400).json({ error: 'member_id is required' });
  try {
    const [rows] = await pool.query(queries.getAttendanceMetrics, [member_id]);
    res.json(rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getFees = async (req, res) => {
  const { member_id } = req.query;
  if (!member_id) return res.status(400).json({ error: 'member_id is required' });
  try {
    const [rows] = await pool.query(queries.getFees, [member_id]);
    res.json(rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getAttendance = async (req, res) => {
  const { student_id, month, year } = req.query;
  if (!student_id || !month || !year) return res.status(400).json({ error: 'student_id, month, and year are required' });
  try {
    const [rows] = await pool.query(queries.getAttendanceByMonthYear, [student_id, month, year]);
    res.json({ calendarDays: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getMarks = async (req, res) => {
  const { student_id } = req.query;
  if (!student_id) return res.status(400).json({ error: 'student_id is required' });
  try {
    const [rows] = await pool.query(queries.getMarks, [student_id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getSyllabus = async (req, res) => {
  const { member_id } = req.query;
  if (!member_id) return res.status(400).json({ error: 'member_id is required' });
  try {
    const [rows] = await pool.query(queries.getSyllabus, [member_id]);
    res.json(rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getRemarks = async (req, res) => {
  const { member_id } = req.query;
  if (!member_id) return res.status(400).json({ error: 'member_id is required' });
  try {
    const [rows] = await pool.query(queries.getRemarks, [member_id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getAttendanceTrend = async (req, res) => {
  const { student_id, year } = req.query;
  if (!student_id || !year) return res.status(400).json({ error: 'student_id and year are required' });
  try {
    const [rows] = await pool.query(queries.getAttendanceTrend, [student_id, year]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = {
  getProfile,
  getFees,
  getAttendance,
  getMarks,
  getSyllabus,
  getRemarks,
  getAttendanceMetrics,
  getAttendanceTrend
};
