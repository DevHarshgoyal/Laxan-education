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

const getFees = async (req, res) => {
  const { student_id } = req.query;
  if (!student_id) return res.status(400).json({ error: 'student_id is required' });
  try {
    const [rows] = await pool.query(queries.getFees, [student_id]);
    res.json(rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getAttendance = async (req, res) => {
  const { student_id } = req.query;
  if (!student_id) return res.status(400).json({ error: 'student_id is required' });
  try {
    const [rows] = await pool.query(queries.getAttendance, [student_id]);
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
  const { student_id } = req.query;
  if (!student_id) return res.status(400).json({ error: 'student_id is required' });
  try {
    const [rows] = await pool.query(queries.getSyllabus, [student_id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getRemarks = async (req, res) => {
  const { student_id } = req.query;
  if (!student_id) return res.status(400).json({ error: 'student_id is required' });
  try {
    const [rows] = await pool.query(queries.getRemarks, [student_id]);
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
  getRemarks
};
