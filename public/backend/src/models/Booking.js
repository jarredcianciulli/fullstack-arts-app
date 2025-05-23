const mongoose = require("mongoose");

// Subdocument schema for individual schedule entries
const scheduleEntrySchema = new mongoose.Schema(
  {
    day: { type: String },
    time: { type: String },
    date: { type: Date, required: [true, "Booking date is required."] },
    startTime: { type: String, required: [true, "Start time is required."] },
    endTime: { type: String, required: [true, "End time is required."] },
  },
  { _id: false }
);

// Subdocument schema for custom fields
const customFieldSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    input: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema({
  student_relationship: { type: String },
  student_name: {
    type: String,
    required: [true, "Student name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    lowercase: true,
  },
  customerPhone: {
    type: String,
  },
  location: {
    description: { type: String },
    placeId: { type: String },
    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" },
    },
    addressComponents: {
      street_number: String,
      route: String,
      locality: String,
      administrative_area_level_1: String,
      postal_code: String,
      country: String,
    },
    distance: { type: Number },
    travel_price: { type: Number },
  },
  package: {
    type: String,
    required: [true, "Lesson package is required."],
  },
  schedule_sessions: { type: Number },
  preferred_cadence: { type: String },

  schedule: {
    type: [scheduleEntrySchema],
  },
  additionalNotes: {
    type: String,
  },
  customFields: {
    type: [customFieldSchema],
    default: [],
  },
  totalAmount: {
    type: Number,
  },
  currency: {
    type: String,
    default: "usd",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  stripeSessionId: {
    type: String,
    sparse: true,
  },
  stripePaymentIntentId: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
