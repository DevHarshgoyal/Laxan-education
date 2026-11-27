require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const { logger, requestLogger, errorLogger } = require('./middleware/logger');
const dashboardRoutes = require('./routes/dashboardRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const accountingRoutes = require('./routes/accountingRoutes');

const app = express();
const corsOptions = {
  origin: ['https://trackprofile.id', 'https://www.trackprofile.id', 'http://localhost:5173'],
  optionsSuccessStatus: 200
};

// Global Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

const PORT = process.env.PORT || 5000;

// API Routes
app.use('/api', dashboardRoutes);
app.use('/api', registrationRoutes);
app.use('/api/accounting', accountingRoutes);

// Health check endpoint
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'UP', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    logger.error('Health check failed: DB unreachable', err);
    res.status(503).json({ status: 'DOWN', database: 'disconnected', error: err.message });
  }
});

// 404 Handler for undefined routes
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Global Error Logger
app.use(errorLogger);

// Verify Database Connection and Start Server
pool.query('SELECT 1')
  .then(() => {
    logger.info(`Connected to MySQL Database: ${process.env.DB_NAME || 'laxan_dashboard'}`);
    app.listen(PORT, () => {
      logger.info(`Server initialized and running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to MySQL Database on startup:', err);
    // Still start server so developer can see 500s rather than silent death
    app.listen(PORT, () => {
      logger.warn(`Server running on http://localhost:${PORT} with DB connection errors`);
    });
  });
