module.exports = {
  getProfile: 'SELECT name, course_name AS course, student_id AS id, profile_id, photo_url FROM students WHERE student_id = ?',
  getFees: 'SELECT total_amount AS total, paid_amount AS paid, pending_amount AS pending, pct_paid AS pctPaid FROM fees WHERE student_id = ?',
  getAttendance: 'SELECT day AS date, dayname AS day, status FROM attendance_days WHERE student_id = ?',
  getAttendanceByMonthYear: 'SELECT day AS date, dayname AS day, status FROM attendance_days WHERE memberid = ? AND month = ? AND year = ?',
  getAttendanceTrend: "SELECT month, COUNT(*) as total_days, SUM(CASE WHEN status = 'P' THEN 1 ELSE 0 END) as present_days FROM attendance_days WHERE memberid = ? AND year = ? GROUP BY month",
  getMarks: 'SELECT test_date AS date, percent FROM test_marks WHERE memberid = ?',
  getSyllabus: 'SELECT math, english, reasoning, polity, geography, history, economy, snt, statics, comp FROM syllabus_coverage WHERE memberid = ?',
  getRemarks: 'SELECT remark_text AS text FROM teacher_remarks WHERE student_id = ?',
  getAttendanceMetrics: 'SELECT total_attendance, total_present, total_absent FROM syllabus_coverage WHERE memberid = ?',

  // Registration Queries
  checkStudentExists: 'SELECT id FROM students WHERE student_id = ?',
  registerStudent: 'INSERT INTO students (student_id, name, course_name, dob, attendance_pct, photo_url, validity, gender, profile_id, doa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  insertFees: 'INSERT INTO fees (student_id, total_amount, paid_amount, pending_amount, pct_paid) VALUES (?, ?, ?, ?, ?)'
};
