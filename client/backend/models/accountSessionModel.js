const mongoose = require("mongoose");

// Define session schema
const accountSessionSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
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
const AccountSession = mongoose.model("AccountSession", accountSessionSchema);

module.exports = AccountSession;
