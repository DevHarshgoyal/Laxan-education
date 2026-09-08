// backend/middleware/logger.js
// Centralized, structured logging utility with Express request & error middleware

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const logger = {
  info: (msg, ...meta) => {
    console.log(
      `${colors.dim}[${getTimestamp()}]${colors.reset} ${colors.green}[INFO]${colors.reset} ${msg}`,
      meta.length ? meta : ''
    );
  },

  warn: (msg, ...meta) => {
    console.warn(
      `${colors.dim}[${getTimestamp()}]${colors.reset} ${colors.yellow}[WARN]${colors.reset} ${msg}`,
      meta.length ? meta : ''
    );
  },

  error: (msg, err, ...meta) => {
    const errorDetails = err ? (err.stack || err.message || err) : '';
    console.error(
      `${colors.dim}[${getTimestamp()}]${colors.reset} ${colors.red}[ERROR]${colors.reset} ${msg}`,
      errorDetails,
      meta.length ? meta : ''
    );
  },

  debug: (msg, ...meta) => {
    if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
      console.log(
        `${colors.dim}[${getTimestamp()}]${colors.reset} ${colors.cyan}[DEBUG]${colors.reset} ${msg}`,
        meta.length ? meta : ''
      );
    }
  }
};

/**
 * Express Request Logger Middleware
 * Logs HTTP Method, Path, Status Code, and Elapsed Time
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;

    let statusColor = colors.green;
    if (status >= 500) statusColor = colors.red;
    else if (status >= 400) statusColor = colors.yellow;
    else if (status >= 300) statusColor = colors.cyan;

    const logLine = `${colors.dim}[${getTimestamp()}]${colors.reset} ${colors.blue}[HTTP]${colors.reset} ${req.method} ${req.originalUrl || req.url} ${statusColor}${status}${colors.reset} (${duration}ms)`;

    if (status >= 500) {
      console.error(logLine);
    } else if (status >= 400) {
      console.warn(logLine);
    } else {
      console.log(logLine);
    }
  });

  next();
};

/**
 * Global Error Handler Middleware
 */
const errorLogger = (err, req, res, _next) => {
  const timestamp = getTimestamp();
  console.error(
    `${colors.dim}[${timestamp}]${colors.reset} ${colors.red}[UNCAUGHT ERROR]${colors.reset} ${req.method} ${req.originalUrl}`,
    err.stack || err
  );

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  logger,
  requestLogger,
  errorLogger
};
