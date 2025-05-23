const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const path = require("path");
const Booking = require("../models/Booking"); // Import the updated model

// Correctly load environment variables for Stripe keys
dotenv.config({ path: path.resolve(__dirname, "../../config.env") });

// Dynamically use test or live keys based on NODE_ENV
const stripe = require("stripe")(
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY_TEST
);

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

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: newBooking.currency,
              product_data: {
                name: `Booking - ${newBooking.package}`,
                description: `Booking for ${newBooking.student_name}`,
              },
              unit_amount: totalAmountCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: newBooking.email,
        success_url: `${process.env.FRONTEND_URL}/payment/complete?session_id={CHECKOUT_SESSION_ID}&booking_id=${newBooking._id}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        metadata: {
          bookingId: newBooking._id.toString(),
        },
      });

      console.log(
        `Stripe Checkout Session created: ${session.id} for booking ${newBooking._id}`
      );
      res.status(200).json({
        sessionId: session.id,
        bookingId: newBooking._id.toString(),
      });
    } catch (stripeError) {
      console.error("Error creating Stripe checkout session:", stripeError);
      return res.status(500).json({
        error: `Stripe session creation failed: ${stripeError.message}`,
      });
    }
  } catch (error) {
    console.error("Unexpected error in /create-checkout-session:", error);
    res
      .status(500)
      .json({ error: "An unexpected error occurred processing the payment." });
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

module.exports = router;
