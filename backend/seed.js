const mysql = require('mysql2/promise');
const queries = require('./models/queries');
require('dotenv').config();

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    port: process.env.DB_PORT || 3306,
  });

  const dbName = process.env.DB_NAME || 'laxan_dashboard';

  console.log(`Creating database ${dbName} if not exists...`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  await connection.query(`USE \`${dbName}\`;`);

  console.log("Creating tables...");

  await connection.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id VARCHAR(50) UNIQUE,
      name VARCHAR(100),
      course_name VARCHAR(100),
      dob VARCHAR(50),
      attendance_pct INT,
      photo_url VARCHAR(500)
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS fees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id VARCHAR(50) UNIQUE,
      total_amount INT,
      paid_amount INT,
      pending_amount INT,
      pct_paid INT
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS attendance_days (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id VARCHAR(50),
      date INT,
      day_name VARCHAR(10),
      status VARCHAR(2)
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS test_marks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id VARCHAR(50),
      test_date VARCHAR(50),
      marks_obtained INT,
      total_marks INT
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS syllabus_coverage (
      id INT AUTO_INCREMENT PRIMARY KEY,
      memberid VARCHAR(50),
      math INT DEFAULT 0,
      english INT DEFAULT 0,
      reasoning INT DEFAULT 0,
      polity INT DEFAULT 0,
      geography INT DEFAULT 0,
      history INT DEFAULT 0,
      economy INT DEFAULT 0,
      snt INT DEFAULT 0,
      statics INT DEFAULT 0,
      comp INT DEFAULT 0,
      total_attendance INT DEFAULT 0
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS teacher_remarks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id VARCHAR(50),
      remark_text TEXT
    );
  `);

  console.log("Clearing old data...");
  await connection.query(`DELETE FROM students`);
  await connection.query(`DELETE FROM fees`);
  await connection.query(`DELETE FROM attendance_days`);
  await connection.query(`DELETE FROM test_marks`);
  await connection.query(`DELETE FROM syllabus_coverage`);
  await connection.query(`DELETE FROM teacher_remarks`);

  const studentId = 'LX-2025-0142';

  console.log("Inserting static data...");
  await connection.query(
    queries.registerStudent,
    [studentId, 'Abhishek Kirar', 'SSC Combo', '14 Aug 2004', 92, null]
  );

  await connection.query(
    queries.insertFees,
    [studentId, 28000, 18000, 10000, 64]
  );

  const calendarDays = [
    [1, 'Mon', 'P'], [2, 'Tue', 'A'], [3, 'Wed', 'A'], [4, 'Thu', 'P'], [5, 'Fri', 'P'],
    [8, 'Mon', 'P'], [9, 'Tue', 'P'], [10, 'Wed', 'P'], [11, 'Thu', 'A'], [12, 'Fri', 'P'],
    [15, 'Mon', 'P'], [16, 'Tue', 'A'], [17, 'Wed', 'P'], [18, 'Thu', 'P'], [19, 'Fri', 'P'],
    [22, 'Mon', 'P'], [23, 'Tue', 'P'], [24, 'Wed', 'P'], [25, 'Thu', 'A'], [26, 'Fri', 'P']
  ];
  for (let d of calendarDays) {
    await connection.query(
      `INSERT INTO attendance_days (student_id, date, day_name, status) VALUES (?, ?, ?, ?)`,
      [studentId, d[0], d[1], d[2]]
    );
  }

  const tests = [
    ['12 Dec 25', 185, 200], ['19 Dec 25', 160, 200], ['26 Dec 25', 145, 200],
    ['02 Jan 26', 125, 200], ['09 Jan 26', 190, 200], ['16 Jan 26', 175, 200]
  ];
  for (let t of tests) {
    await connection.query(
      `INSERT INTO test_marks (student_id, test_date, marks_obtained, total_marks) VALUES (?, ?, ?, ?)`,
      [studentId, t[0], t[1], t[2]]
    );
  }

  await connection.query(
    `INSERT INTO syllabus_coverage (memberid, math, english, reasoning, polity, geography, history, economy, snt, statics, comp, total_attendance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [studentId, 82, 90, 75, 50, 60, 40, 30, 20, 10, 88, 100]
  );

  const remarks = [
    "Great improvement in mathematics test scores.",
    "Needs to focus more on completing assignments on time.",
    "Attendance is excellent, keep it up!"
  ];
  for (let r of remarks) {
    await connection.query(
      `INSERT INTO teacher_remarks (student_id, remark_text) VALUES (?, ?)`,
      [studentId, r]
    );
  }

  console.log("Seeding complete!");
  await connection.end();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
