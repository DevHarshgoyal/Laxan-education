const rateLimit = require('express-rate-limit');
const { logger } = require('./logger');

/**
 * Rate limiter for accounting login attempts to prevent brute-force attacks.
 * Allows maximum 10 attempts per 15 minutes per IP.
 */
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts from this IP. Please try again after 15 minutes.'
  },
  handler: (req, res, _next, options) => {
    logger.warn(`[RateLimit] IP ${req.ip} exceeded login attempt limit (max: ${options.max} per 15m) on ${req.originalUrl}`);
    res.status(options.statusCode || 429).json(options.message);
  }
});

module.exports = {
  loginRateLimiter
};
