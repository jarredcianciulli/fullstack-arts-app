const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
});

// Process payment
router.post('/process', async (req, res) => {
  try {
    const { paymentMethodId, amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'http://localhost:3000/payment/success'
    });

    res.json({
      success: true,
      paymentIntent
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      message: 'Payment failed',
      error: error.message
    });
  }
});

module.exports = router;
