const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const path = require("path");
const Booking = require("../models/Booking"); // Import the updated model

// Correctly load environment variables for Stripe keys
dotenv.config({ path: path.resolve(__dirname, "../../config.env") });

// Dynamically use test or live keys based on NODE_ENV
const secretKeyInUse = process.env.NODE_ENV === "production"
  ? process.env.STRIPE_SECRET_KEY
  : process.env.STRIPE_SECRET_KEY_TEST;

console.log(`[PaymentRoute] Initializing Stripe with NODE_ENV: ${process.env.NODE_ENV}. Using secret key: ${secretKeyInUse ? secretKeyInUse.substring(0, 8) + '...' + secretKeyInUse.substring(secretKeyInUse.length - 4) : 'NOT FOUND'}`);

const stripe = require("stripe")(secretKeyInUse);

// Helper function to parse time string (e.g., "7:00pm") to HH:mm format
const parseTime = (timeStr) => {
  if (!timeStr) return null;
  const lowerTime = timeStr.toLowerCase();
  const match = lowerTime.match(/(\d{1,2}):(\d{2})(am|pm)?/);
  if (!match) return null; // Invalid format

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];

  if (period === "pm" && hours < 12) {
    hours += 12;
  } else if (period === "am" && hours === 12) {
    // Midnight case
    hours = 0;
  }

  // Format to HH:mm (e.g., 07:00, 19:00)
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};

// Helper function to calculate end time (assuming 1 hour duration for now)
const calculateEndTime = (startTime) => {
  if (!startTime) return null;
  const [hours, minutes] = startTime.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setHours(date.getHours() + 1); // Add 1 hour
  const endHours = String(date.getHours()).padStart(2, "0");
  const endMinutes = String(date.getMinutes()).padStart(2, "0");
  return `${endHours}:${endMinutes}`;
};

// POST /api/payment/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { formData } = req.body;
    console.log(
      "Received formData on backend:",
      JSON.stringify(formData, null, 2)
    ); // Log received data

    // --- VALIDATION ---
    if (
      !formData ||
      !formData.schedule_selection ||
      !formData.package ||
      !formData.student_name ||
      !formData.email ||
      !formData.totalAmount
    ) {
      console.error("Validation Failed: Missing required fields in formData.");
      return res.status(400).json({
        error:
          "Missing required fields for payment session. Check schedule_selection, package, student_name, email, totalAmount.",
      });
    }

    // --- SCHEDULE PARSING ---
    let parsedSchedule = [];
    let mappedSchedule = [];
    try {
      parsedSchedule = JSON.parse(formData.schedule_selection);
      if (!Array.isArray(parsedSchedule) || parsedSchedule.length === 0) {
        throw new Error("Parsed schedule_selection is not a non-empty array.");
      }

      mappedSchedule = parsedSchedule.map((item) => {
        const startTime = parseTime(item.time);
        const endTime = calculateEndTime(startTime);
        const bookingDate = item.date ? new Date(item.date) : null;

        if (
          !startTime ||
          !endTime ||
          !bookingDate ||
          isNaN(bookingDate.getTime())
        ) {
          throw new Error(
            `Invalid time ('${item.time}') or date ('${item.date}') format in schedule_selection.`
          );
        }

        return {
          day: item.day,
          time: item.time,
          date: bookingDate,
          startTime: startTime,
          endTime: endTime,
        };
      });
    } catch (parseError) {
      console.error("Error parsing or mapping schedule_selection:", parseError);
      return res.status(400).json({
        error: `Failed to parse or map schedule_selection: ${parseError.message}`,
      });
    }

    // --- CREATE PENDING BOOKING ---
    let newBooking;
    try {
      newBooking = new Booking({
        student_relationship: formData.student_relationship,
        student_name: formData.student_name,
        email: formData.email,
        customerPhone: formData.customerPhone,
        location: formData.location || {}, // Handle optional location
        package: formData.package,
        schedule_sessions: formData.schedule_sessions,
        preferred_cadence: formData.preferred_cadence,
        schedule: mappedSchedule,
        additionalNotes: formData.additionalNotes,
        customFields: formData.customFields || [],
        totalAmount: formData.totalAmount,
        currency: formData.currency || "usd",
        paymentStatus: "pending",
      });

      await newBooking.save();
      console.log(`Pending booking created successfully: ${newBooking._id}`);
    } catch (dbError) {
      console.error("Error saving booking to database:", dbError);
      return res.status(500).json({ error: "Failed to save booking data." });
    }

    // --- CREATE STRIPE CHECKOUT SESSION ---
    try {
      const totalAmountCents = Math.round(newBooking.totalAmount * 100);

       // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Booking - ${formData.package}`,
              description: `Booking for ${formData.student_name}`,
            },
            unit_amount: Math.round(formData.totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: formData.email,
      success_url: `${process.env.FRONTEND_URL}/payment/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    });

    console.log(`Stripe Checkout Session created: ${session.id}`);
    res.status(200).json({ clientSecret: session.client_secret, bookingId: newBooking._id });
  } catch (error) {
    console.error("Error in /create-checkout-session:", error);
    res.status(500).json({ error: "Failed to create Checkout Session." });
  }
  } catch (error) { // Catch for the outer try block (started on line 56)
    console.error("Unhandled error in /create-checkout-session route:", error);
    res.status(500).json({ error: "An unexpected error occurred processing your request." });
  }
});

// POST /api/payment/create-payment-intent - For Stripe Embedded Checkout
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { formData } = req.body;
    console.log(
      "Received formData for /create-payment-intent:",
      JSON.stringify(formData, null, 2)
    );

    // --- VALIDATION ---
    if (
      !formData ||
      !formData.schedule_selection || // Ensure this is passed if needed for booking
      !formData.package ||
      !formData.student_name ||
      !formData.email ||
      !formData.totalAmount ||
      typeof formData.totalAmount !== 'number' ||
      formData.totalAmount <= 0
    ) {
      console.error("Validation Failed: Missing or invalid required fields in formData for Payment Intent.");
      return res.status(400).json({
        error:
          "Missing or invalid required fields for payment intent. Check schedule_selection, package, student_name, email, and totalAmount (must be a positive number).",
      });
    }

    // --- SCHEDULE PARSING (Copy from /create-checkout-session if booking creation needs it) ---
    let parsedSchedule = [];
    let mappedSchedule = [];
    if (formData.schedule_selection) { // Make schedule parsing conditional if not always present
      try {
        parsedSchedule = JSON.parse(formData.schedule_selection);
        if (!Array.isArray(parsedSchedule) || parsedSchedule.length === 0) {
          // Allow empty schedule if your booking logic permits
          // throw new Error("Parsed schedule_selection is not a non-empty array.");
        }
        mappedSchedule = parsedSchedule.map((item) => {
          const startTime = parseTime(item.time);
          const endTime = calculateEndTime(startTime);
          const bookingDate = item.date ? new Date(item.date) : null;
          if (
            !startTime ||
            !endTime ||
            !bookingDate ||
            isNaN(bookingDate.getTime())
          ) {
            throw new Error(
              `Invalid time ('${item.time}') or date ('${item.date}') format in schedule_selection.`
            );
          }
          return {
            day: item.day,
            time: item.time,
            date: bookingDate,
            startTime: startTime,
            endTime: endTime,
          };
        });
      } catch (parseError) {
        console.error("Error parsing or mapping schedule_selection for Payment Intent:", parseError);
        return res.status(400).json({
          error: `Failed to parse or map schedule_selection: ${parseError.message}`,
        });
      }
    }

    // --- CREATE PENDING BOOKING ---
    let newBooking;
    try {
      newBooking = new Booking({
        student_relationship: formData.student_relationship,
        student_name: formData.student_name,
        email: formData.email,
        customerPhone: formData.customerPhone,
        location: formData.location || {},
        package: formData.package,
        schedule_sessions: formData.schedule_sessions,
        preferred_cadence: formData.preferred_cadence,
        schedule: mappedSchedule, // Use potentially empty mappedSchedule
        additionalNotes: formData.additionalNotes,
        customFields: formData.customFields || [],
        totalAmount: formData.totalAmount,
        currency: formData.currency || "usd",
        paymentStatus: "pending", // Initial status
      });
      await newBooking.save();
      console.log(`Pending booking created successfully for Payment Intent: ${newBooking._id}`);
    } catch (dbError) {
      console.error("Error saving booking to database for Payment Intent:", dbError);
      return res.status(500).json({ error: "Failed to save booking data." });
    }

    // --- CREATE STRIPE PAYMENT INTENT ---
    try {
      const totalAmountCents = Math.round(newBooking.totalAmount * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmountCents,
        currency: newBooking.currency,
        receipt_email: formData.email, // For sending email receipts to the customer
        metadata: {
          bookingId: newBooking._id.toString(),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log(
        `Stripe Payment Intent created: ${paymentIntent.id} for booking ${newBooking._id}`
      );
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        bookingId: newBooking._id.toString(),
      });
    } catch (stripeError) {
      console.error("Error creating Stripe Payment Intent:", stripeError);
      // Consider reversing booking creation or marking it as failed if PI creation fails
      return res.status(500).json({
        error: `Stripe Payment Intent creation failed: ${stripeError.message}`,
      });
    }
  } catch (error) {
    console.error("Unexpected error in /create-payment-intent:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

// Endpoint to get Stripe public key
router.get("/stripe-key", (req, res) => {
  const publishableKey =
    process.env.NODE_ENV === "production"
      ? process.env.STRIPE_PUBLIC_KEY
      : process.env.STRIPE_PUBLIC_KEY_TEST;

  if (!publishableKey) {
    console.error("Stripe publishable key not found in environment variables.");
    return res.status(500).send({ error: "Stripe configuration error." });
  }
  res.send({ publishableKey });
});


// Stripe Webhook Handler
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!sig || !webhookSecret) {
      console.log('[Webhook] Error: Missing stripe-signature or webhook secret.');
      return res.status(400).send('Webhook Error: Missing signature or secret.');
    }
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(`[Webhook] Signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      console.log('[Webhook] PaymentIntent succeeded:', paymentIntentSucceeded.id, 'for booking:', paymentIntentSucceeded.metadata.bookingId);
      // Retrieve bookingId from metadata
      const bookingId = paymentIntentSucceeded.metadata.bookingId;
      if (bookingId) {
        try {
          const booking = await Booking.findById(bookingId);
          if (booking) {
            if (booking.paymentStatus !== 'confirmed') { // Idempotency check
              booking.paymentStatus = 'confirmed';
              booking.stripePaymentIntentId = paymentIntentSucceeded.id; // Store PI ID
              await booking.save();
              console.log(`[Webhook] Booking ${bookingId} updated to confirmed.`);
            } else {
              console.log(`[Webhook] Booking ${bookingId} already confirmed.`);
            }
          } else {
            console.log(`[Webhook] Booking ${bookingId} not found.`);
          }
        } catch (dbError) {
          console.error(`[Webhook] Error updating booking ${bookingId}:`, dbError);
          // Potentially return 500 to Stripe if critical, so it retries
        }
      } else {
        console.log('[Webhook] Warning: bookingId not found in PaymentIntent metadata for PI:', paymentIntentSucceeded.id);
      }
      break;
    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object;
      console.log('[Webhook] PaymentIntent failed:', paymentIntentFailed.id, 'Reason:', paymentIntentFailed.last_payment_error?.message);
      const failedBookingId = paymentIntentFailed.metadata.bookingId;
      if (failedBookingId) {
        try {
          const booking = await Booking.findById(failedBookingId);
          if (booking) {
            if (booking.paymentStatus !== 'confirmed') { // Avoid overwriting a confirmed payment
                booking.paymentStatus = 'payment_failed';
                if (paymentIntentFailed.last_payment_error) {
                    booking.paymentFailureReason = paymentIntentFailed.last_payment_error.message;
                }
                await booking.save();
                console.log(`[Webhook] Booking ${failedBookingId} updated to payment_failed.`);
            } else {
                 console.log(`[Webhook] Booking ${failedBookingId} was already confirmed, ignoring payment failure.`);
            }
          } else {
            console.log(`[Webhook] Booking ${failedBookingId} not found for payment failure event.`);
          }
        } catch (dbError) {
          console.error(`[Webhook] Error updating booking ${failedBookingId} to failed:`, dbError);
        }
      }
      break;
    // Add other event types as needed, e.g., 'charge.refunded', 'customer.subscription.deleted'
    default:
      console.log(`[Webhook] Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send();
});

module.exports = router;

