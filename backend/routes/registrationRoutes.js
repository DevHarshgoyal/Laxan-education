const express = require('express');
const router  = express.Router();
const { registerStudent } = require('../controllers/registrationController');
const upload              = require('../middleware/upload');

// POST /api/register — multipart/form-data (photo optional)
router.post('/register', upload.single('photo'), registerStudent);

module.exports = router;
