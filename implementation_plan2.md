# SQL Database Integration

This plan outlines the steps to replace the static data in your Node.js backend with a real SQL database connection.

## User Review Required & Open Questions

> [!IMPORTANT]
> Before I can execute this plan, I need some information from you regarding your database:
> 
> 1. **Which SQL Database are you using?** (e.g., MySQL, PostgreSQL, SQLite, MS SQL Server)
> 2. **Is the database already running locally?** Do you have a database name, username, and password ready?
> 
> *(If you just want a quick, file-based database without installing any extra software on your computer, we can use **SQLite**. Let me know your preference!)*

## Proposed Changes

### 1. Database Setup & Configuration
- Install the required Node.js database driver (e.g., `mysql2`, `pg`, or `sqlite3`).
- Install `dotenv` to securely manage your database credentials.
- Create a `backend/db.js` file to establish and export the database connection pool.

### 2. Schema Creation & Data Migration
I will design a normalized SQL schema to hold the dashboard data. A setup script (e.g., `backend/seed.js`) will be created to generate the tables and insert your current static data into them.

The proposed tables are:
- `students` (name, course, dob, student_id)
- `fees` (student_id, total, paid)
- `attendance` (student_id, date, status)
- `marks` (student_id, test_date, marks_obtained, total_marks)
- `syllabus` (student_id, subject_name, pct_completed)
- `remarks` (student_id, text)

### 3. API Updates
I will rewrite all the existing endpoints in `backend/server.js` to execute `SELECT` queries against the SQL database instead of returning hardcoded arrays:

#### [MODIFY] backend/server.js
- `GET /api/profile`
- `GET /api/fees`
- `GET /api/attendance`
- `GET /api/marks`
- `GET /api/syllabus`
- `GET /api/remarks`

## Verification Plan
1. Run the database seed script to ensure tables are created and populated without errors.
2. Start the `nodemon` server and verify it connects to the SQL database successfully.
3. Test the frontend dashboard to ensure it seamlessly loads data from the new SQL-backed APIs.
