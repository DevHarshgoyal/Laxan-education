const jwt = require('jsonwebtoken');
const { logger } = require('./logger');

const JWT_SECRET = process.env.JWT_SECRET || 'laxan_institute_secure_jwt_secret_key_2026_x9f#q';

/**
 * Middleware to authenticate requests via JWT Bearer token.
 * Protects financial and institutional report endpoints.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7).trim() 
    : null;

  if (!token) {
    logger.warn(`[Auth] Blocked unauthenticated request to ${req.originalUrl} from IP: ${req.ip}`);
    return res.status(401).json({ 
      error: 'Access denied. Authentication token required to access accounting reports.' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      logger.warn(`[Auth] Session expired for token on ${req.originalUrl} from IP: ${req.ip}`);
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    logger.warn(`[Auth] Rejected invalid token on ${req.originalUrl} from IP: ${req.ip} - ${err.message}`);
    return res.status(403).json({ error: 'Invalid authentication token.' });
  }
}

module.exports = {
  authenticateToken,
  JWT_SECRET
};
