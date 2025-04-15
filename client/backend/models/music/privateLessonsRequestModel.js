const mongoose = require("mongoose");

const privateLessonsRequestSchema = new mongoose.Schema(
  {
    instrument: {
      type: String,
      required: true,
    },
    yearsPlayed: {
      type: String,
      required: true,
    },
    studentName: { type: String },
    certify18: Boolean,
    studentsAge: { type: String },
    sponsorName: { type: String },
    sponsorType: { type: String },
    telephone: { type: String },
    email: { type: String },
    preferredDays: { type: [String] },
    preferredTimes: { type: Object },
    availableToStart: { type: String },
    additionalInformation: { type: String },
    schoolPreferred: { type: String },
    bestTimeToReach: { type: String },
    bestMethodToReach: { type: String },
    updated_on: {
      type: Date,
      default: Date.now,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const PrivateLessonsRequest = mongoose.model(
  "PrivateLessonsRequest",
  privateLessonsRequestSchema
);

module.exports = PrivateLessonsRequest;
