require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dashboardRoutes = require('./routes/dashboardRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

const { asyncLocalStorage } = require('./config/db');

const app = express();
const corsOptions = {
  origin: ['https://trackprofile.id', 'https://www.trackprofile.id', 'http://localhost:5173'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Old API paths (fallback/default database)
app.use('/api', dashboardRoutes);
app.use('/api', registrationRoutes);

// Middleware to set the active database context for dynamic API paths
const instituteMiddleware = (req, res, next) => {
  const { institute } = req.params;
  asyncLocalStorage.run(institute, () => {
    next();
  });
};

// New Multi-tenant API paths (dynamic database selection)
app.use('/inst/:institute/api', instituteMiddleware, dashboardRoutes);
app.use('/inst/:institute/api', instituteMiddleware, registrationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
