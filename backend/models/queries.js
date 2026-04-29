module.exports = {
  getProfile: 'SELECT name, course_name AS course, student_id AS id, dob, attendance_pct AS attendance, photo_url FROM students WHERE student_id = ?',
  getFees: 'SELECT total_amount AS total, paid_amount AS paid, pending_amount AS pending, pct_paid AS pctPaid FROM fees WHERE student_id = ?',
  getAttendance: 'SELECT date, day_name AS day, status FROM attendance_days WHERE student_id = ?',
  getMarks: 'SELECT test_date AS date, marks_obtained AS marks, total_marks AS total FROM test_marks WHERE student_id = ?',
  getSyllabus: 'SELECT subject_name AS name, pct_completed AS pct, color_code AS color FROM syllabus_coverage WHERE student_id = ?',
  getRemarks: 'SELECT remark_text AS text FROM teacher_remarks WHERE student_id = ?',

  // Registration Queries
  checkStudentExists: 'SELECT id FROM students WHERE student_id = ?',
  registerStudent: 'INSERT INTO students (student_id, name, course_name, dob, attendance_pct, photo_url, validity, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  insertFees: 'INSERT INTO fees (student_id, total_amount, paid_amount, pending_amount, pct_paid) VALUES (?, ?, ?, ?, ?)'
};
