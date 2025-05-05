const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const availabilityRoutes = require('./routes/availability');
const locationRoutes = require('./routes/location');

console.log('Setting up routes...');
app.use('/api/availability', availabilityRoutes);
app.use('/api/location', locationRoutes);
console.log('Routes set up successfully');

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- /api/availability/*');
  console.log('- /api/location/*');
});
