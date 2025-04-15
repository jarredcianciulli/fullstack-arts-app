const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Account = require("../models/accountModel");
const AccountSession = require("./../models/accountSessionModel");

const { createJSONToken, isValidPassword } = require("../utils/auth");
const { isValidEmail, isValidText } = require("../utils/validation");
const { NotAuthError } = require("../utils/errors");
const { sign, verify } = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    secure: true,
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await Account.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

exports.claim;

exports.signup = catchAsync(async (req, res, next) => {
  const data = req.body;
  let errors = {};

  if (!isValidEmail(data.email)) {
    errors.email = "Invalid email.";
  } else {
    try {
      const existingUser = await get(data.email);
      if (existingUser) {
        errors.email = "Email exists already.";
      }
    } catch (error) {}
  }
  if (!isValidText(data.password, 6)) {
    errors.password = "Invalid password. Must be at least 6 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "User signup failed due to validation errors.",
      errors,
    });
  }
  try {
    const newUser = await Account.create(req.body);
    createSendToken(newUser, 201, req, res);
  } catch (error) {
    next(error);
  }
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;

  // First check for Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    // Extract the token after "Bearer "
    token = req.headers.authorization.split(" ")[1];
  }
  // Otherwise check for cookies
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await Account.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await Account.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentAccount.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles[('admin', 'lead-admin')].role = 'user';

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await Account.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email using SendGrid
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken}`;

    const msg = {
      to: user.email, // User's email
      from: "jarred.cianciulli@jcianci.io", // Your verified sender email
      subject: "Your Password Reset Token (Valid for 10 Minutes)",
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await sgMail.send(msg);

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    // Clean up in case of error
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  const resetToken = req.params.resetToken; // Get resetToken from URL

  // Hash the reset token to match the stored version
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find the account associated with the reset token and ensure it's not expired
  const account = await Account.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // Ensure token is not expired
  });

  if (!account) {
    return next(new AppError("Invalid or expired password reset token.", 400));
  }

  // Validate password
  let errors = {};
  if (!isValidText(password, 6)) {
    errors.password = "Invalid password. Must be at least 6 characters long.";
  }
  if (password !== passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Password reset failed due to validation errors.",
      errors,
    });
  }

  // Set the new password and remove reset token fields
  account.password = password;
  account.passwordConfirm = passwordConfirm;
  account.passwordResetToken = undefined;
  account.passwordResetExpires = undefined;

  await account.save();

  // Log the user in by creating and sending a JWT
  createSendToken(account, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await Account.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

exports.checkInviteToken = catchAsync(async (req, res, next) => {
  const { invite_token } = req.params;
  // Hash the token to match the stored version
  const hashedToken = crypto
    .createHash("sha256")
    .update(invite_token)
    .digest("hex");

  // Find the account with the matching token and ensure it hasn't expired
  const account = await Account.findOne({
    inviteToken: hashedToken,
    inviteTokenExpires: { $gt: Date.now() }, // Ensure it's not expired
  });

  if (!account) {
    return next(new AppError("Invalid or expired invite token.", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      valid: true,
      email: account.email, // Optional, could be used for pre-filling forms
    },
  });
});

exports.claimAccount = catchAsync(async (req, res, next) => {
  const { inviteToken, password, passwordConfirm } = req.body;

  // Hash the invite token to match the stored version
  const hashedToken = crypto
    .createHash("sha256")
    .update(inviteToken)
    .digest("hex");

  // Find the account associated with the invite token
  const account = await Account.findOne({
    inviteToken: hashedToken,
    inviteTokenExpires: { $gt: Date.now() }, // Ensure it's not expired
  });

  if (!account) {
    return next(new AppError("Invalid or expired invite token.", 400));
  }

  // Validate password
  let errors = {};
  if (!isValidText(password, 6)) {
    errors.password = "Invalid password. Must be at least 6 characters long.";
  }
  if (password !== passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Account claim failed due to validation errors.",
      errors,
    });
  }

  // Set the new password and remove invite token fields
  account.password = password;
  account.passwordConfirm = passwordConfirm;
  account.inviteToken = undefined;
  account.inviteTokenExpires = undefined;

  await account.save();

  // Log the user in by creating and sending a JWT
  createSendToken(account, 200, req, res);
});

exports.checkSession = catchAsync(async (req, res, next) => {
  // 1) Getting token and checking if it's there
  let accessToken;
  let refreshToken;
  if (req.cookies.j_cianciulli_access) {
    accessToken = req.cookies.j_cianciulli_access;
    refreshToken = req.cookies.j_cianciulli_rfsh;
  }

  if (!accessToken || !refreshToken) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verifying token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(accessToken, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("Invalid token! Please log in again.", 401));
  }

  // 3) Checking if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) check if session exists
  const currentSession = await AccountSession.findOne({
    accessToken: accessToken,
    refreshToken: refreshToken,
  });

  if (!currentSession) {
    return next(new AppError("There is no session.", 401));
  }
  const currentDate = new Date();

  // 4) check if session access token is expired

  if (currentSession.accessTokenExpiresAt < currentDate) {
    return next(new AppError("Access token is expired.", 401));
  }

  // 5) check if session refresh token is expired

  if (currentSession.refreshTokenExpiresAt < currentDate) {
    return next(new AppError("Refresh token is expired.", 401));
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    // 6) Checking if user changed password after the token was issued
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  res.locals.user = currentUser;
  res.send("You have access to this route!");
});
