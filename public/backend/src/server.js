const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Import routes
const registrationRoutes = require('./routes/registration');
const paymentRoutes = require('./routes/payment');
const locationRoutes = require('./routes/location');

// Use routes
app.use('/api/registration', registrationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/location', locationRoutes);

// MongoDB connection
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/soundworks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
