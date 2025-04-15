const mongoose = require("mongoose");

// Define session schema
const userSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
    unique: true,
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true,
  },
  refreshTokenExpiresAt: {
    type: Date,
    required: true,
  },
  accessTokenExpiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  // Additional session data (e.g., IP address, user agent)
  ipAddress: String,
  userAgent: String,
});

// Create Session model
const UserSession = mongoose.model("UserSession", userSessionSchema);

module.exports = UserSession;
