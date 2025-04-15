const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const counter1Schema = new mongoose.Schema({
  name: { type: String, required: true },
  seq: { type: Number, required: true },
});

// Counter model to track the `userID` sequence
const Counter1 = mongoose.model("Counter1", counter1Schema);

const accountSchema = new mongoose.Schema(
  {
    userID: { type: Number, unique: true },
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
    photo: { type: String, default: "default.jpg" },
    stripeId: { type: String },
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
    password: { type: String, minlength: 8, select: false },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    preferred_name: String,
    birthdate: Date,
    authMethod: {
      type: String,
      enum: ["password", "google"],
      default: "password",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    email_verified: { type: Boolean, default: false },
    claimed: { type: Boolean, default: false },
    active: { type: Boolean, default: true, select: false },
    availability: [{ type: mongoose.Schema.ObjectId, ref: "Availability" }],
    image: { type: String, default: "default.png", required: true },
    // Password Claim System
    pwClaimToken: String,
    pwClaimExpires: Date,

    // Invitation System
    inviteToken: String,
    inviteTokenExpires: Date,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

// Virtual field for concatenated full name
accountSchema.virtual("name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});
accountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // This removes it from being saved
  next();
});
// Middleware to increment `userID` for each new user
accountSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter1.findOneAndUpdate(
      { name: "userID" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.userID = counter.seq;
  }
  next();
});

accountSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

accountSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: true } });
  next();
});

// Method to check if password matches
accountSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to check if password changed after token issued
accountSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Password Reset Token
accountSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Invite Token
accountSchema.methods.createInviteToken = function () {
  const inviteToken = crypto.randomBytes(32).toString("hex");

  this.inviteToken = crypto
    .createHash("sha256")
    .update(inviteToken)
    .digest("hex");
  this.inviteTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

  return inviteToken;
};

// Password Claim Token
accountSchema.methods.createPwClaimToken = function () {
  const claimToken = crypto.randomBytes(32).toString("hex");

  this.pwClaimToken = crypto
    .createHash("sha256")
    .update(claimToken)
    .digest("hex");
  this.pwClaimExpires = Date.now() + 24 * 60 * 60 * 1000;

  return claimToken;
};

const Account = mongoose.model("Account", accountSchema);
module.exports = Account;
