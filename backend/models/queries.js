module.exports = {
  getProfile: 'SELECT name, course_name AS course, student_id AS id, profile_id, photo_url FROM students WHERE student_id = ?',
  getFees: 'SELECT fee_prc AS pctPaid FROM fee_cloude WHERE memberid = ?',
  getAttendance: 'SELECT day AS date, dayname AS day, status FROM attendance_days WHERE student_id = ?',
  getAttendanceByMonthYear: 'SELECT day AS date, dayname AS day, status FROM attendance_days WHERE memberid = ? AND month = ? AND year = ?',
  getAttendanceTrend: "SELECT month, COUNT(*) as total_days, SUM(CASE WHEN status = 'P' THEN 1 ELSE 0 END) as present_days FROM attendance_days WHERE memberid = ? AND year = ? GROUP BY month",
  getMarks: 'SELECT id, test_date AS date, percent, math_per, eng_per, reas_per, gs_per FROM test_marks WHERE memberid = ?',
  getSyllabus: 'SELECT math, english, reasoning, polity, geography, history, economy, snt, statics, comp FROM syllabus_coverage WHERE memberid = ?',
  getRemarks: 'SELECT remark_text AS text, rdate AS date FROM teacher_remark WHERE memberid = ?',
  getAttendanceMetrics: 'SELECT total_attendance, total_present, total_absent FROM syllabus_coverage WHERE memberid = ?',

  // Registration Queries
  checkStudentExists: 'SELECT id FROM students WHERE student_id = ?',
  registerStudent: 'INSERT INTO students (student_id, name, course_name, dob, attendance_pct, photo_url, validity, gender, profile_id, doa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  insertFees: 'INSERT INTO fee_cloude (memberid, fee_prc) VALUES (?, ?)'
};
