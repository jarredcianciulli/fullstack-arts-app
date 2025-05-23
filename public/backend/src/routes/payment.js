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

const stripe = require("stripe")(secretKeyInUse, {
  apiVersion: "2024-04-10", // Testing latest stable API version for Embedded Checkout compatibility
});

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
    const { formData, cancel_url } = req.body;
    console.log("Received custom cancel_url:", cancel_url);
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

    // Extract necessary data from formData and define variables
    const student_name = formData.student_name;
    const email = formData.email;
    const packageName = typeof formData.package === 'object' && formData.package.name ? formData.package.name : (typeof formData.package === 'string' ? formData.package : "Unnamed Package");
    const schedule_sessions = formData.schedule_sessions;
    const totalAmount = formData.totalAmount; // This should be a number
    const currency = formData.currency || "usd"; // Default to USD if not provided
    const totalAmountCents = Math.round(parseFloat(totalAmount) * 100); // Ensure totalAmount is a number and convert to cents

    if (isNaN(totalAmountCents)) {
        console.error("Validation Failed: totalAmount is not a valid number.", formData.totalAmount);
        return res.status(400).json({ error: "Invalid totalAmount provided." });
    }

    // --- CREATE PENDING BOOKING ---
    let newBooking;
    try {
      newBooking = new Booking({
        student_relationship: formData.student_relationship,
        student_name: student_name,
        email: email,
        customerPhone: formData.customerPhone,
        location: formData.location || {},
        package: packageName, // Use the extracted package name
        schedule_sessions: schedule_sessions,
        preferred_cadence: formData.preferred_cadence,
        schedule: mappedSchedule, // Use the parsed and mapped schedule
        additionalNotes: formData.additionalNotes,
        customFields: formData.customFields || [],
        totalAmount: totalAmount,
        currency: currency,
        paymentStatus: "pending",
        payment_intent_id: null,
        checkout_session_id: null, // Will be updated after session creation
        booking_date: new Date(),
        lessons: [], // Populate if necessary
      });
      await newBooking.save();
      console.log(`Pending booking created successfully: ${newBooking._id}`);
    } catch (dbError) {
      console.error("Error saving new booking:", dbError.message, dbError.stack);
      return res.status(500).json({ error: "Failed to save booking: " + dbError.message });
    }

    // --- CREATE STRIPE CHECKOUT SESSION ---
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency, // Use the defined currency
            product_data: {
              name: `Music Lessons: ${packageName}`, // Use the defined packageName
              description: schedule_sessions ? `Package of ${schedule_sessions} lessons for ${student_name}` : `Music lessons for ${student_name}`,
            },
            unit_amount: totalAmountCents, // Use the calculated amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email, // Use the defined email
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${newBooking._id.toString()}`,
      cancel_url: cancel_url || `${process.env.FRONTEND_URL}/payment-cancel?booking_id=${newBooking._id.toString()}`,
      client_reference_id: newBooking._id.toString(),
      metadata: {
        bookingId: newBooking._id.toString(),
      },
    });

    // Update the booking with the checkout session ID
    newBooking.checkout_session_id = session.id;
    await newBooking.save(); // Save again to store the session ID

    console.log(`Stripe Checkout Session created: ${session.id} for booking ${newBooking._id}`);
    res.json({ sessionId: session.id, bookingId: newBooking._id.toString() });

  } catch (error) {
    console.error("[Checkout Session] Error creating session:", error.message, error.stack);
    res.status(500).json({ error: "Failed to create checkout session: " + error.message });
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
        automatic_payment_methods: { enabled: true },
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

// GET /api/payment/verify-session
router.get("/verify-session", async (req, res) => {
  const { session_id, booking_id } = req.query;

  if (!session_id || !booking_id) {
    console.log('[VerifySession] Missing session_id or booking_id in query params');
    return res.status(400).json({ success: false, message: "Missing session_id or booking_id." });
  }

  try {
    console.log(`[VerifySession] Verifying session_id: ${session_id} for booking_id: ${booking_id}`);
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      console.log(`[VerifySession] Stripe session not found for id: ${session_id}`);
      return res.status(404).json({ success: false, message: "Stripe session not found." });
    }

    // Verify payment status and client reference ID
    if (session.payment_status === 'paid' && session.client_reference_id === booking_id) {
      console.log(`[VerifySession] Payment confirmed for session: ${session_id}. Client reference ID matches booking: ${booking_id}.`);
      // Find and update the booking
      const booking = await Booking.findById(booking_id);
      if (!booking) {
        console.log(`[VerifySession] Booking not found for id: ${booking_id}`);
        return res.status(404).json({ success: false, message: "Booking not found." });
      }

      if (booking.paymentStatus === 'paid') {
        console.log(`[VerifySession] Booking ${booking_id} already marked as paid.`);
        return res.json({ success: true, message: "Payment already verified and booking updated.", booking });
      }

      booking.paymentStatus = 'paid'; // Or 'succeeded', 'completed' as per your schema
      booking.payment_intent_id = session.payment_intent; // Store payment intent ID if available
      await booking.save();
      console.log(`[VerifySession] Booking ${booking_id} updated to paid.`);

      // TODO: Consider sending a confirmation email here if not handled by webhooks

      return res.json({ success: true, message: "Payment verified and booking updated successfully.", booking });
    } else {
      console.log(`[VerifySession] Payment not confirmed or booking ID mismatch for session: ${session_id}. Payment status: ${session.payment_status}, Client Ref: ${session.client_reference_id}`);
      return res.status(400).json({
        success: false,
        message: "Payment not successful or booking ID mismatch.",
        details: {
          payment_status: session.payment_status,
          client_reference_id_match: session.client_reference_id === booking_id,
        },
      });
    }
  } catch (error) {
    console.error("[VerifySession] Error verifying payment session:", error.message, error.stack);
    // Check for specific Stripe errors if needed, e.g., invalid session ID format
    if (error.type === 'StripeInvalidRequestError') {
        return res.status(400).json({ success: false, message: `Stripe API error: ${error.message}` });
    }
    return res.status(500).json({ success: false, message: "Internal server error while verifying payment: " + error.message });
  }
});

module.exports = router;

