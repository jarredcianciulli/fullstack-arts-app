const express = require('express');
const stripe = require('stripe')(process.env.NODE_ENV === 'development' ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking'); // Import the Booking model

const router = express.Router();

// Use express.raw() for this specific route to get the raw body for signature verification
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!sig || !webhookSecret) {
        console.error('Webhook Error: Missing signature or webhook secret.');
        return res.status(400).send('Webhook Error: Missing signature or secret.');
    }
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    console.log(`Webhook received: ${event.type}`);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`Processing checkout.session.completed for session: ${session.id}`);

      // Check if we have metadata and the booking ID
      if (session.metadata && session.metadata.bookingId) {
          const bookingId = session.metadata.bookingId;
          console.log(`Found bookingId in metadata: ${bookingId}`);

          try {
              const booking = await Booking.findById(bookingId);

              if (booking) {
                   // IMPORTANT: Check if payment status is already 'paid' to handle potential duplicate webhooks
                   if (booking.paymentStatus === 'paid') {
                       console.log(`Booking ${bookingId} is already marked as paid. Ignoring duplicate webhook.`);
                   } else {
                       // Update booking status and payment details
                       booking.paymentStatus = 'paid';
                       booking.stripeSessionId = session.id;
                       booking.stripePaymentIntentId = session.payment_intent;
                       await booking.save();
                       console.log(`Booking ${bookingId} updated to paid.`);

                       // --- Future Actions ---
                       // TODO: Send confirmation email
                       // TODO: Notify relevant staff/systems
                       // TODO: Update calendar availability if applicable
                   }
              } else {
                  console.error(`Webhook Error: Booking not found for ID: ${bookingId}`);
                  // Decide how to handle this - maybe log for manual intervention
              }
          } catch(dbError) {
              console.error(`Webhook DB Error: Failed to update booking ${bookingId}: ${dbError.message}`);
              // Return 500 to signal Stripe to retry? Or 400 if it's a data issue?
              // For now, let's return 500 to encourage retries for transient DB issues.
              return res.status(500).json({ received: false, error: 'Database update failed' });
          }

      } else {
          console.error('Webhook Error: checkout.session.completed event missing bookingId in metadata.');
          // If bookingId is critical, maybe return 400?
      }
      break;

    // case 'payment_intent.succeeded':
    //   const paymentIntentSucceeded = event.data.object;
    //   // Handle payment intent success (often redundant if using checkout session completion)
    //   break;

    case 'payment_intent.payment_failed':
       const paymentIntentFailed = event.data.object;
       console.log(`Processing payment_intent.payment_failed for intent: ${paymentIntentFailed.id}`);
       // TODO: Potentially find associated booking via metadata (if added) or paymentIntentId
       // and update status to 'failed'. Notify user?
       // Example: Check session metadata if available, or query Booking by stripePaymentIntentId
       // Note: The corresponding session might not have bookingId if failure happened early.
       if (paymentIntentFailed.metadata && paymentIntentFailed.metadata.bookingId) {
            // ... update logic similar to success case, but set status to 'failed'
            console.log(`Payment failed for booking ID: ${paymentIntentFailed.metadata.bookingId}`);
            // Find booking, update status to 'failed'
            try {
                 const failedBooking = await Booking.findOneAndUpdate(
                     { _id: paymentIntentFailed.metadata.bookingId },
                     { paymentStatus: 'failed', stripePaymentIntentId: paymentIntentFailed.id }, // Update intent ID too
                     { new: true }
                 );
                 if (failedBooking) {
                    console.log(`Booking ${failedBooking._id} status updated to 'failed'.`);
                 } else {
                    console.log(`Booking ${paymentIntentFailed.metadata.bookingId} not found for failure update.`);
                 }
            } catch (dbError) {
                 console.error(`Webhook DB Error: Failed to update booking ${paymentIntentFailed.metadata.bookingId} to failed: ${dbError.message}`);
                 return res.status(500).json({ received: false, error: 'Database update failed' });
            }
       } else {
           console.log('Payment failed event missing bookingId metadata. Cannot automatically update booking status.');
       }
       break;

    // ... handle other event types as needed

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
});

module.exports = router;
