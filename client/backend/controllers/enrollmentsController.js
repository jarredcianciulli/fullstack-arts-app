const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Use your Stripe Secret Key
const Enrollment = require("../models/enrollmentsModel");
const mongoose = require("mongoose");
const factory = require("./handlerFactory");

const app = require("express")();

// Use body-parser.raw() to preserve the raw request body for Stripe verification
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // ✅ Ensure `req.body` is treated as a raw buffer for Stripe verification
    event = stripe.webhooks.constructEvent(
      req.body, // This is now a Buffer, not a parsed object
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Webhook verified:", event.type);
  } catch (err) {
    console.error("⚠️ Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const enrollment = await Enrollment.findOne({
        stripeSessionId: session.id,
      });

      if (!enrollment) {
        console.warn(`⚠️ No enrollment found for session ID: ${session.id}`);
        return res.status(404).json({ error: "Enrollment not found" });
      }

      // Update enrollment details
      const durationMap = { "4-month": 4, "6-month": 6, "12-month": 12 };
      enrollment.paid = true;
      enrollment.active = true;
      enrollment.startDate = new Date();
      enrollment.endDate = new Date();
      enrollment.endDate.setMonth(
        enrollment.endDate.getMonth() + (durationMap[enrollment.tier] || 0)
      );
      enrollment.stripePaymentIntentId = session.payment_intent;

      await enrollment.save();
      console.log(`✅ Enrollment updated: ${enrollment._id}`);
    } catch (err) {
      console.error("❌ Error updating enrollment:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  res.json({ received: true });
};

/**
 * Create a Stripe Checkout Session
 */

exports.createCheckoutSession = async (req, res) => {
  try {
    const { sponsorId, clientInfo, tier, successUrl, cancelUrl } = req.body;

    // Ensure sponsorId is a valid ObjectId using `new`
    const sponsorObjectId = new mongoose.Types.ObjectId(sponsorId); // Correct

    // Define pricing for each tier
    const pricing = {
      "4-month": 40000, // $400
      "6-month": 55000, // $550
      "12-month": 100000, // $1000
    };
    console.log(pricing, tier);
    // Check if the tier is valid
    if (!pricing[tier]) {
      return res.status(400).json({ error: "Invalid enrollment tier" });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${tier} Enrollment`,
            },
            unit_amount: pricing[tier], // Stripe requires amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    // Create a pending Enrollment record
    const enrollment = new Enrollment({
      sponsor: sponsorObjectId, // Use the valid ObjectId here
      clientInfo,
      tier,
      price: pricing[tier] / 100, // Store price in dollars
      stripeSessionId: session.id,
      paid: false,
      active: false,
    });

    await enrollment.save();

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createEnrollment = factory.createOne(Enrollment);
exports.getEnrollment = factory.getOne(Enrollment);
exports.getAllEnrollments = factory.getAllBySponsor(Enrollment);
exports.updateEnrollment = factory.updateOne(Enrollment);
exports.deleteEnrollment = factory.deleteOne(Enrollment);
