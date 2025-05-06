const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const path = require('path');
const Booking = require('../models/Booking'); // Import the updated model

// Correctly load environment variables for Stripe keys
dotenv.config({ path: path.resolve(__dirname, '../../config.env') });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_TEST); // Use test key for now

// Helper function to parse time string (e.g., "7:00pm") to HH:mm format
const parseTime = (timeStr) => {
  if (!timeStr) return null;
  const lowerTime = timeStr.toLowerCase();
  const match = lowerTime.match(/(\d{1,2}):(\d{2})(am|pm)?/);
  if (!match) return null; // Invalid format

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];

  if (period === 'pm' && hours < 12) {
    hours += 12;
  } else if (period === 'am' && hours === 12) { // Midnight case
    hours = 0;
  }

  // Format to HH:mm (e.g., 07:00, 19:00)
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
};

// Helper function to calculate end time (assuming 1 hour duration for now)
const calculateEndTime = (startTime) => {
    if (!startTime) return null;
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    date.setHours(date.getHours() + 1); // Add 1 hour
    const endHours = String(date.getHours()).padStart(2, '0');
    const endMinutes = String(date.getMinutes()).padStart(2, '0');
    return `${endHours}:${endMinutes}`;
};


// POST /api/payment/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { formData } = req.body;
    console.log("Received formData on backend:", JSON.stringify(formData, null, 2)); // Log received data

    // --- MODIFIED VALIDATION ---
    // Validate fields required for *this route* (creating a payment session)
    // IMPORTANT: email and totalAmount MUST be added to frontend formData
    if (!formData ||
        !formData.schedule_selection || // Check for the JSON string
        !formData.lesson_package ||
        !formData.student_name ||
        !formData.email || // Use renamed field
        !formData.totalAmount) {     // Still required (in cents)
      console.error("Validation Failed: Missing required fields in formData.", formData);
      return res.status(400).json({ error: 'Missing required fields for payment session. Check schedule_selection (JSON string), lesson_package, student_name, email, totalAmount.' });
    }

    // --- SCHEDULE PARSING AND MAPPING ---
    let parsedSchedule = [];
    let mappedSchedule = [];
    try {
        parsedSchedule = JSON.parse(formData.schedule_selection);
        if (!Array.isArray(parsedSchedule) || parsedSchedule.length === 0) {
            throw new Error('Parsed schedule_selection is not a non-empty array.');
        }

        // Map to the Booking model's schedule structure
        mappedSchedule = parsedSchedule.map(item => {
            const startTime = parseTime(item.time); // Convert "7:00pm" -> "19:00"
            const endTime = calculateEndTime(startTime); // Calculate end time (e.g., "20:00")
            const bookingDate = item.date ? new Date(item.date) : null; // Parse date string

             if (!startTime || !endTime || !bookingDate || isNaN(bookingDate.getTime())) {
                console.error("Mapping failed for schedule item:", item);
                throw new Error(`Invalid time ('${item.time}') or date ('${item.date}') format in schedule_selection.`);
             }

            return {
                day: item.day, // Keep original day if needed
                time: item.time, // Keep original time string if needed
                date: bookingDate, // Store as Date object
                startTime: startTime,
                endTime: endTime,
            };
        });

    } catch (parseError) {
        console.error("Error parsing or mapping schedule_selection:", parseError, formData.schedule_selection);
        return res.status(400).json({ error: `Failed to parse or map schedule_selection: ${parseError.message}` });
    }
    // --- END SCHEDULE PARSING ---

    // --- CREATE PENDING BOOKING using Updated Fields ---
    let newBooking;
    try {
      newBooking = new Booking({
        // Map frontend names/structures to backend model names/structures
        student_relationship: formData.student_relationship,
        student_name: formData.student_name, // Use renamed field
        email: formData.email, // Use renamed field
        customerPhone: formData.customerPhone, // Optional
        location: { // Assuming frontend sends structure matching the log
          description: formData.location.address, // Use 'address' from log
          placeId: formData.location.placeId, // Need this from frontend state
          coordinates: formData.location.coordinates, // GeoJSON format [lng, lat]
          addressComponents: formData.location.addressComponents, // Optional
          distance: formData.location.distance, // Optional
          travel_price: formData.location.travel_price // Optional (store in cents?)
        },
        lesson_package: formData.lesson_package, // Use renamed field
        schedule_sessions: formData.schedule_sessions,
        preferred_cadence: formData.preferred_cadence,
        schedule: mappedSchedule, // Use the mapped schedule array
        additionalNotes: formData.additionalNotes,
        customFields: formData.customFields, // Pass through if provided
        totalAmount: formData.totalAmount,   // Still required (in cents)
        currency: formData.currency || 'usd', // Default if not provided
        paymentStatus: 'pending', // Initial status
      });

      await newBooking.save();
      console.log(`Pending booking created successfully: ${newBooking._id}`);

    } catch (dbError) {
      console.error("Error saving booking to database:", dbError);
      // Check for Mongoose validation errors
      if (dbError.name === 'ValidationError') {
          const errors = Object.values(dbError.errors).map(el => el.message);
          return res.status(400).json({ error: `Database validation failed: ${errors.join(', ')}` });
      }
      return res.status(500).json({ error: 'Failed to save booking data.' });
    }
    // --- END BOOKING CREATION ---


    // --- PREPARE STRIPE DATA (Convert totalAmount to cents) --- >
    const totalAmountDollars = newBooking.totalAmount; // Assuming this is the dollar value, e.g., 615.25
    const totalAmountCents = Math.round(totalAmountDollars * 100); // Convert to cents integer, e.g., 61525

    // --- CREATE STRIPE CHECKOUT SESSION ---
    try {
      const line_items = [{
        price_data: {
          currency: newBooking.currency,
          product_data: {
            name: `Booking - ${newBooking.lesson_package || 'Service'}`, // Use lesson_package
            description: `Booking for ${newBooking.student_name}`, // Use student_name
            // images: ['your_image_url_here'], // Optional product image
          },
          unit_amount: totalAmountCents, // Use the calculated cents value
        },
        quantity: 1,
      }];

      const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded', // <-- ADD THIS for Embedded Checkout
        payment_method_types: ['card'], // Or allow user selection?
        line_items: line_items,
        mode: 'payment',
        // Include bookingId in metadata AND return URL
        metadata: {
          bookingId: newBooking._id.toString(), // Convert ObjectId to string
          // Add other relevant data if needed
        },
        customer_email: newBooking.email, // Pre-fill email using renamed field
        return_url: `${process.env.FRONTEND_URL}/payment/complete?session_id={CHECKOUT_SESSION_ID}&booking_id=${newBooking._id.toString()}`, // <-- ADD THIS
        // Consider expires_at for session timeout
        // expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // e.g., 30 minutes from now
      });

      console.log(`Stripe Checkout Session created: ${session.id} for booking ${newBooking._id}`);
      res.status(200).json({
        sessionId: session.id,
        bookingId: newBooking._id.toString(),
        clientSecret: session.client_secret // Send client secret for Embedded Checkout
      }); // Send clientSecret for embedded checkout

    } catch (stripeError) {
        console.error("Error creating Stripe checkout session:", stripeError);
        // Attempt to clean up the pending booking if Stripe fails? (Optional)
        // await Booking.findByIdAndDelete(newBooking._id);
        return res.status(500).json({ error: `Stripe session creation failed: ${stripeError.message}` });
    }
    // --- END STRIPE SESSION ---

  } catch (error) {
    // General catch-all for unexpected errors
    console.error("Unexpected error in /create-checkout-session:", error);
    res.status(500).json({ error: 'An unexpected error occurred processing the payment.' });
  }
});


// Endpoint to get Stripe public key
router.get('/stripe-key', (req, res) => {
    const publishableKey = process.env.NODE_ENV === 'development'
      ? process.env.STRIPE_PUBLIC_KEY_TEST
      : process.env.STRIPE_PUBLIC_KEY;

    if (!publishableKey) {
      console.error("Stripe publishable key not found in environment variables.");
      return res.status(500).send({ error: 'Stripe configuration error.' });
    }
    res.send({ publishableKey });
});


module.exports = router;
