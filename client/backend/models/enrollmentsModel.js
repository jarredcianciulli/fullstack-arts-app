const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  sponsor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  clientInfo: [{ name: String, email: String, relation: String }],
  tier: {
    type: String,
    enum: ["4-month", "6-month", "12-month"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Active", "Complete"],
    default: "Pending",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stripeSessionId: {
    type: String,
    required: true,
  },
  stripePaymentIntentId: {
    type: String,
    default: null, // Populated after payment is confirmed
  },
  paid: {
    type: Boolean,
    default: false, // Updated when Stripe confirms payment
  },
  active: {
    type: Boolean,
    default: false, // Enrollment activates after successful payment
  },
  startDate: {
    type: Date,
    default: null, // Set when payment is confirmed
  },
  endDate: {
    type: Date,
    default: null, // Auto-calculated from startDate + tier duration
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
