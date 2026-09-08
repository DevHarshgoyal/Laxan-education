const pool = require('../config/db');
const queries = require('../models/queries');
const { logger } = require('../middleware/logger');

const getProfile = async (req, res) => {
  const { student_id } = req.query;
  if (!student_id) return res.status(400).json({ error: 'student_id is required' });
  try {
    const [rows] = await pool.query(queries.getProfile, [student_id]);
    res.json(rows[0] || {});
  } catch (err) {
    logger.error(`[getProfile] Database error fetching profile for student_id: ${student_id}`, err);
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
    logger.error(`[getAttendanceMetrics] Database error fetching metrics for member_id: ${member_id}`, err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getFees = async (req, res) => {
  const id = req.query.member_id || req.query.student_id;
  if (!id) return res.status(400).json({ error: 'member_id or student_id is required' });

  try {
    // 1. Query the new tables: member_cloude, payfee_cloude, and dues
    const [memberRows] = await pool.query(queries.getMemberCloudFee, [id]);
    const [paidRows] = await pool.query(queries.getPaymentsTotalPaid, [id]);
    const [duesSummaryRows] = await pool.query(queries.getPendingDuesSummary, [id]);
    const [payments] = await pool.query(queries.getPaymentsCloud, [id]);
    const [dues] = await pool.query(queries.getDuesCloud, [id]);

    if (memberRows.length > 0 || payments.length > 0 || dues.length > 0) {
      const member = memberRows[0] || {};
      const totalAmount = parseFloat(member.totalfee) || 0;
      const paidAmount = parseFloat(paidRows[0]?.total_paid) || 0;
      const pendingDues = parseFloat(duesSummaryRows[0]?.total_dues) || 0;
      const pendingAmount = totalAmount > 0 ? Math.max(0, totalAmount - paidAmount) : pendingDues;
      const pctPaid = totalAmount > 0
        ? Math.min(100, Math.round((paidAmount / totalAmount) * 100))
        : 0;
      const nextDueDate = duesSummaryRows[0]?.next_due_date || null;

      return res.json({
        memberId: id,
        name: member.name || null,
        course: member.course || null,
        startDate: member.startdate || null,
        totalAmount,
        paidAmount,
        pendingAmount,
        pctPaid,
        nextDueDate,
        payments,
        dues
      });
    }

    // 2. Fallback to `fees` table for backwards compatibility
    const [legacyFees] = await pool.query(queries.getFeesFromFeesTable, [id]);
    if (legacyFees.length > 0) {
      const f = legacyFees[0];
      return res.json({
        memberId: id,
        totalAmount: f.totalAmount || 0,
        paidAmount: f.paidAmount || 0,
        pendingAmount: f.pendingAmount || 0,
        pctPaid: f.pctPaid || 0,
        nextDueDate: null,
        payments: [],
        dues: []
      });
    }

    // 3. Fallback to `fee_cloude` table
    const [feeCloudRows] = await pool.query(queries.getFees, [id]);
    if (feeCloudRows.length > 0) {
      return res.json({
        memberId: id,
        pctPaid: parseFloat(feeCloudRows[0].pctPaid) || 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        nextDueDate: null,
        payments: [],
        dues: []
      });
    }

    // 4. Default empty state
    return res.json({
      memberId: id,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      pctPaid: 0,
      nextDueDate: null,
      payments: [],
      dues: []
    });
  } catch (err) {
    logger.error(`[getFees] Database error fetching fee details for member_id: ${id}`, err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getPaymentHistory = async (req, res) => {
  const id = req.query.member_id || req.query.student_id;
  if (!id) return res.status(400).json({ error: 'member_id or student_id is required' });
  try {
    const [rows] = await pool.query(queries.getPaymentsCloud, [id]);
    res.json(rows);
  } catch (err) {
    logger.error(`[getPaymentHistory] Database error fetching payments for member_id: ${id}`, err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getDues = async (req, res) => {
  const id = req.query.member_id || req.query.student_id;
  if (!id) return res.status(400).json({ error: 'member_id or student_id is required' });
  try {
    const [rows] = await pool.query(queries.getDuesCloud, [id]);
    res.json(rows);
  } catch (err) {
    logger.error(`[getDues] Database error fetching dues for member_id: ${id}`, err);
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
    logger.error(`[getAttendance] Database error for student_id: ${student_id}, month: ${month}, year: ${year}`, err);
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
    logger.error(`[getMarks] Database error for student_id: ${student_id}`, err);
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
    logger.error(`[getSyllabus] Database error for member_id: ${member_id}`, err);
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
    logger.error(`[getRemarks] Database error for member_id: ${member_id}`, err);
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
    logger.error(`[getAttendanceTrend] Database error for student_id: ${student_id}, year: ${year}`, err);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = {
  getProfile,
  getFees,
  getPaymentHistory,
  getDues,
  getAttendance,
  getMarks,
  getSyllabus,
  getRemarks,
  getAttendanceMetrics,
  getAttendanceTrend
};
