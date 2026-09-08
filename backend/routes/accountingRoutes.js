const express = require('express');
const router = express.Router();
const accountingController = require('../controllers/accountingController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { loginRateLimiter } = require('../middleware/rateLimiter');

// Authentication (Rate-limited to prevent brute-force attacks)
router.post('/login', loginRateLimiter, accountingController.login);

// Institutional Reports (Protected via JWT Bearer authentication)
router.get('/reports/remaining-fees', authenticateToken, accountingController.getRemainingFeesReport);
router.get('/reports/day-wise-collection', authenticateToken, accountingController.getDayWiseCollectionReport);
router.get('/reports/student-list', authenticateToken, accountingController.getStudentListReport);

module.exports = router;
