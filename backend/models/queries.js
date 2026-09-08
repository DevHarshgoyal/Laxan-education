module.exports = {
  getProfile: 'SELECT name, course_name AS course, student_id AS id, profile_id, photo_url FROM students WHERE student_id = ?',
  getFees: 'SELECT fee_prc AS pctPaid FROM fee_cloude WHERE memberid = ?',
  getFeesFromFeesTable: 'SELECT total_amount AS totalAmount, paid_amount AS paidAmount, pending_amount AS pendingAmount, pct_paid AS pctPaid FROM fees WHERE student_id = ?',

  // Cloud Fee, Payments & Dues Queries (member_cloude, payfee_cloude, dues)
  getMemberCloudFee: 'SELECT memberid, name, course, totalfee, startdate FROM member_cloude WHERE memberid = ?',
  getPaymentsCloud: 'SELECT id, recno, memberid, name, feesdate, installment AS amount, pmode FROM payfee_cloude WHERE memberid = ? ORDER BY feesdate DESC, id DESC',
  getPaymentsTotalPaid: 'SELECT COALESCE(SUM(CAST(installment AS DECIMAL(10,2))), 0) AS total_paid FROM payfee_cloude WHERE memberid = ?',
  getDuesCloud: 'SELECT id, mid AS memberid, nextduedate, installment AS amount, status, usr FROM dues WHERE mid = ? ORDER BY nextduedate ASC, id ASC',
  getPendingDuesSummary: "SELECT COALESCE(SUM(CAST(installment AS DECIMAL(10,2))), 0) AS total_dues, MIN(nextduedate) AS next_due_date FROM dues WHERE mid = ? AND (status IS NULL OR LOWER(status) != 'paid')",

  getAttendance: 'SELECT day AS date, dayname AS day, status FROM attendance_days WHERE student_id = ?',
  getAttendanceByMonthYear: 'SELECT day AS date, dayname AS day, status FROM attendance_days WHERE memberid = ? AND month = ? AND year = ?',
  getAttendanceTrend: "SELECT month, COUNT(*) as total_days, SUM(CASE WHEN status = 'P' THEN 1 ELSE 0 END) as present_days FROM attendance_days WHERE memberid = ? AND year = ? GROUP BY month",
  getMarks: 'SELECT id, test_date AS date, percent, math_per, eng_per, reas_per, gs_per FROM test_marks WHERE memberid = ? ORDER BY test_date DESC, id DESC',
  getSyllabus: 'SELECT math, english, reasoning, polity, geography, history, economy, snt, statics, comp FROM syllabus_coverage WHERE memberid = ?',
  getRemarks: 'SELECT remark_text AS text, rdate AS date FROM teacher_remark WHERE memberid = ?',
  getAttendanceMetrics: 'SELECT total_attendance, total_present, total_absent FROM syllabus_coverage WHERE memberid = ?',

  // Registration Queries
  checkStudentExists: 'SELECT id FROM students WHERE student_id = ?',
  registerStudent: 'INSERT INTO students (student_id, name, course_name, dob, attendance_pct, photo_url, validity, gender, profile_id, doa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  insertFees: 'INSERT INTO fee_cloude (memberid, fee_prc) VALUES (?, ?)',

  // Users & Auth Queries
  findUser: 'SELECT id, username, email, password, role FROM users WHERE username = ? OR email = ?',
  insertUser: 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',


  // ── Institutional Reports Queries ──────────────────────────────
  getRemainingFeesReport: `
    SELECT 
      d.id,
      d.mid AS memberid,
      COALESCE(m.name, CONCAT('Student #', d.mid)) AS name,
      COALESCE(m.course, '—') AS course,
      CAST(d.installment AS DECIMAL(10,2)) AS remainFee,
      DATE_FORMAT(d.nextduedate, '%Y-%m-%d') AS nextDueDate,
      d.status,
      d.usr
    FROM dues d
    LEFT JOIN member_cloude m ON d.mid = m.memberid
    WHERE (d.status IS NULL OR LOWER(d.status) != 'paid')
  `,
  getDayWiseCollectionReport: `
    SELECT 
      id,
      memberid,
      DATE_FORMAT(feesdate, '%Y-%m-%d') AS date,
      recno,
      name,
      pmode,
      CAST(installment AS DECIMAL(10,2)) AS amount
    FROM payfee_cloude
    WHERE 1=1
  `,
  getStudentListReport: `
    SELECT 
      id,
      memberid,
      DATE_FORMAT(startdate, '%Y-%m-%d') AS date,
      name,
      course,
      CAST(totalfee AS DECIMAL(10,2)) AS finalFee
    FROM member_cloude
    WHERE 1=1
  `
};

