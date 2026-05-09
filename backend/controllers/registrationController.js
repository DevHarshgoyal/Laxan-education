const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { randomUUID } = require('crypto');
const pool = require('../config/db');
const queries = require('../models/queries');
const s3 = require('../config/s3');

// ── Helpers ────────────────────────────────────────────────

/**
 * Generates a random profile ID with the current year (e.g., LX-2026-0142)
 */
function generateProfileId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `LX-${year}-${randomNum}`;
}

/**
 * Upload a file buffer to S3 and return the public URL.
 * Bucket must have public-read ACL or a bucket policy allowing GetObject.
 */
async function uploadToS3(file) {
  const ext = file.mimetype.split('/')[1] || 'jpg';
  const key = `student-photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const bucket = process.env.AWS_S3_BUCKET;

  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  }));

  // Construct the standard public S3 URL
  return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

// ── Controller ─────────────────────────────────────────────

/**
 * POST /api/register
 * Content-Type: multipart/form-data
 * Fields: name, course_name, dob, phone, email, address, gender
 * File:   photo (optional)
 */
const registerStudent = async (req, res) => {
  // const { student_id, name, course_name, dob, phone, email, address, gender } = req.body;
  const { student_id, name, course_name, gender, doa, validity } = req.body;

  if (!student_id || !name || !course_name || !gender || !doa || !validity) {
    return res.status(400).json({
      success: false,
      message: 'student_id, name, course_name, gender, validity and doa are required fields.',
    });
  }

  try {
    // ── Check if student_id already exists ──
    const [existing] = await pool.query(
      queries.checkStudentExists,
      [student_id.trim()]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Student ID "${student_id}" is already registered.`,
      });
    }

    // ── Generate Profile ID ──
    const profile_id = generateProfileId();

    // ── Upload photo to S3 (if provided) ──
    let photo_url = null;
    if (req.file) {
      try {
        photo_url = await uploadToS3(req.file);
      } catch (s3Err) {
        console.error('[registerStudent] S3 upload error:', s3Err);
        // Don't block registration if S3 fails — just skip the photo
      }
    }

    // ── Insert student row ──
    const [result] = await pool.query(
      queries.registerStudent,
      [student_id.trim(), name.trim(), course_name.trim(), null, 0, photo_url, validity.trim(), gender, profile_id, doa.trim()]
    );

    // ── Seed a blank fees row ──
    await pool.query(
      queries.insertFees,
      [student_id.trim(), 0, 0, 0, 0]
    );

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully!',
      student: {
        id: result.insertId,
        student_id: student_id.trim(),
        name: name.trim(),
        course_name: course_name.trim(),
        doa: doa.trim(),
        validity: validity.trim(),
        gender: gender || null,
        phone: null,
        email: null,
        address: null,
        photo_url,
        attendance_pct: 0,
      },
    });
  } catch (err) {
    console.error('[registerStudent] DB error:', err);
    return res.status(500).json({
      success: false,
      message: 'Database error. Please try again.',
    });
  }
};

module.exports = { registerStudent };
