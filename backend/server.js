require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dashboardRoutes = require('./routes/dashboardRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();
const corsOptions = {
  origin: ['https://trackprofile.id', 'https://www.trackprofile.id', 'http://localhost:5173'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api', dashboardRoutes);
app.use('/api', registrationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
