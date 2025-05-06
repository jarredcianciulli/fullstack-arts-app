const express = require('express');
const router = express.Router();

// Endpoint to get Stripe configuration (e.g., publishable key)
router.get('/stripe', (req, res) => {
  try {
    const publishableKey = process.env.NODE_ENV === 'development'
      ? process.env.STRIPE_PUBLIC_KEY_TEST
      : process.env.STRIPE_PUBLIC_KEY;

    if (!publishableKey) {
      console.error('Stripe publishable key is missing for the current environment.');
      return res.status(500).json({ message: 'Server configuration error: Missing Stripe key.' });
    }

    res.json({ publishableKey });

  } catch (error) {
    console.error('Error fetching Stripe config:', error);
    res.status(500).json({ message: 'Failed to retrieve Stripe configuration.' });
  }
});

module.exports = router;
