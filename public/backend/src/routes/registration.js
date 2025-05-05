const express = require('express');
const router = express.Router();
const Registration = require('../models/registration');
const { sendConfirmationEmail } = require('../controllers/emailController');

// Submit registration
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      serviceType,
      lessonPackage,
      preferredLocation,
      preferredSchedule,
      additionalNotes
    } = req.body;

    const registration = new Registration({
      firstName,
      lastName,
      email,
      phone,
      serviceType,
      lessonPackage,
      preferredLocation,
      preferredSchedule,
      additionalNotes,
      status: 'pending'
    });

    await registration.save();

    // Send confirmation email
    await sendConfirmationEmail(email, {
      firstName,
      serviceType,
      lessonPackage
    });

    res.status(201).json({
      message: 'Registration successful',
      registration
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Get available locations
router.get('/locations', async (req, res) => {
  try {
    // In a real application, this would come from a database
    const locations = [
      { id: 1, name: 'Studio A', address: '123 Music St', availability: true },
      { id: 2, name: 'Studio B', address: '456 Band Ave', availability: true },
      { id: 3, name: 'Home Lessons', address: 'Client Location', availability: true }
    ];
    
    res.json(locations);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch locations',
      error: error.message
    });
  }
});

// Get available schedules
router.get('/schedules', async (req, res) => {
  try {
    // In a real application, this would be dynamic based on instructor availability
    const schedules = [
      { id: 1, day: 'Monday', times: ['9:00 AM', '2:00 PM', '4:00 PM'] },
      { id: 2, day: 'Wednesday', times: ['10:00 AM', '3:00 PM', '5:00 PM'] },
      { id: 3, day: 'Friday', times: ['11:00 AM', '1:00 PM', '6:00 PM'] }
    ];
    
    res.json(schedules);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch schedules',
      error: error.message
    });
  }
});

module.exports = router;
