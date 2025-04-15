const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Availability = require("./availabilityModel");
const sessionsOverviewModel = require("./sessionsOverviewModel");

const counterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    required: true,
  },
});

// Counter model to track the `userID` sequence
const Counter = mongoose.model("Counter", counterSchema);

const userSchema = new mongoose.Schema(
  {
    userID: {
      type: Number,
      unique: true,
    },
    first_name: {
      type: String,
      required: [true, "Please provide your first name!"],
    },
    last_name: {
      type: String,
      required: [true, "Please provide your last name!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
      type: String,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid phone number",
      ],
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    stripeId: {
      type: String,
    },
    role: {
      type: String,
      enum: [
        "user",
        "admin",
        "lead-admin",
        "instructor",
        "instructor-standard",
        "instructor-flex",
        "instructor-principal",
        "owner",
        "student",
      ],
      default: "user",
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    preferred_name: String,
    birthdate: Date,
    passwordConfirm: {
      type: String,
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    authMethod: {
      type: String,
      enum: ["password", "google"],
      default: "password",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    email_verified: { type: Boolean, default: false },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    availability: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Availability",
      },
    ],
    // Invitation System
    inviteToken: String,
    inviteTokenExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true, // Add this line to enable createdAt and updatedAt fields
  }
);

// Virtual field for concatenated full name
userSchema.virtual("name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

// Middleware to increment `userID` for each new user
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "userID" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // Create if it doesn't exist
    );
    this.userID = counter.seq;
  }
  next();
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Method to generate an invite token
userSchema.methods.createInviteToken = function () {
  const inviteToken = crypto.randomBytes(32).toString("hex");

  this.inviteToken = crypto
    .createHash("sha256")
    .update(inviteToken)
    .digest("hex");
  this.inviteTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours

  return inviteToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
