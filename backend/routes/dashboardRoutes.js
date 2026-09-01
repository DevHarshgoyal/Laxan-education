const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/profile', dashboardController.getProfile);
router.get('/fees', dashboardController.getFees);
router.get('/attendance', dashboardController.getAttendance);
router.get('/marks', dashboardController.getMarks);
router.get('/syllabus', dashboardController.getSyllabus);
router.get('/remarks', dashboardController.getRemarks);
router.get('/attendance-metrics', dashboardController.getAttendanceMetrics);
router.get('/attendance-trend', dashboardController.getAttendanceTrend);

module.exports = router;
