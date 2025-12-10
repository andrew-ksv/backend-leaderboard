require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const scoreRoutes = require('./routes/scoreRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routing
app.use('/api/scores', scoreRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Server running on http://localhost:${PORT}`);
      } else {
        console.log(`Server running on port ${PORT}`);
      }
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });