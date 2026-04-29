// middleware/upload.js — multer configured with memory storage
// The uploaded file is kept in-memory as req.file.buffer
// (no temp files on disk) and streamed directly to S3.
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter(_req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  },
});

module.exports = upload;
