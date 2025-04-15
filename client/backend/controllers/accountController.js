const multer = require("multer");
const Account = require("./../models/accountModel");
const fs = require("fs");
const path = require("path");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const crypto = require("crypto");

const sendEmail = require("../utils/email"); // Assuming an email utility
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const AWS = require("aws-sdk");
const sharp = require("sharp");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.uploadProfilePicture = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please upload an image file", 400));
  }
  console.log(req.user);
  const filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // Process image with sharp
  const processedImage = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();
  console.log("processed img", processedImage);
  // Upload to S3
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `profile_pictures/${filename}`,
    Body: processedImage,
    ContentType: "image/jpeg",
  };

  const uploadResult = await s3.upload(uploadParams).promise();
  console.log(uploadResult);
  // Update user profile picture in the database
  const updatedUser = await Account.findByIdAndUpdate(
    req.user.id,
    { photo: uploadResult.Location },
    { new: true, runValidators: true }
  );
  console.log(updatedUser);

  res.status(200).json({
    status: "success",
    message: "Profile picture uploaded successfully!",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteProfilePicture = catchAsync(async (req, res, next) => {
  console.log("hoho", req.user.id);
  const user = await Account.findById(req.user.id);
  if (!user || !user.photo) {
    return next(new AppError("No profile picture found", 404));
  }

  const fileKey = user.photo.split(".com/")[1]; // Extract file path from URL

  // Delete from S3
  await s3
    .deleteObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    })
    .promise();

  // Remove photo from user profile in DB
  user.photo = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Profile picture deleted successfully",
  });
});

exports.getProfilePictureUrl = catchAsync(async (req, res, next) => {
  const user = await Account.findById(req.user.id);
  if (!user || !user.photo) {
    return next(new AppError("No profile picture found", 404));
  }

  const fileKey = user.photo.split(".com/")[1];

  const signedUrl = s3.getSignedUrl("getObject", {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
    Expires: 60 * 5, // 5 minutes
  });

  res.status(200).json({
    status: "success",
    url: signedUrl,
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await Account.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Account.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

exports.getUser = factory.getOne(Account);
exports.getAllUsers = factory.getAll(Account);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(Account);
exports.deleteUser = factory.deleteOne(Account);

exports.create = catchAsync(async (req, res, next) => {
  const { first_name, last_name, email, role } = req.body;

  // Check if user already exists
  const existingUser = await Account.findOne({ email });
  if (existingUser) {
    return next(new AppError("Account with this email already exists!", 400));
  }

  // Create invite token
  const inviteToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(inviteToken)
    .digest("hex");

  // Create new user (inactive, no password yet)
  const newUser = await Account.create({
    first_name,
    last_name,
    email,
    role: role || "user",
    inviteToken: hashedToken,
    inviteTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    active: false, // Account is inactive until they claim the account
  });

  // Read and customize the email template
  const emailTemplatePath = path.join(
    __dirname,
    "..",
    "emails",
    "welcome_email_invite.html"
  );
  let emailHtml = fs.readFileSync(emailTemplatePath, "utf8");
  // Replace placeholders
  emailHtml = emailHtml
    .replace("{{first_name}}", first_name)
    .replace("{{invite_token}}", inviteToken);

  // Send email
  const msg = {
    to: email,
    from: "jarred.cianciulli@jcianci.io",
    subject: "You're Invited! Claim Your Account",
    html: emailHtml,
  };
  //   const msg = {
  //     to: "jcianci1@gmail.com", // Change to your recipient
  //     from: "jarred.cianciulli@jcianci.io", // Change to your verified sender
  //     subject: "Sending with SendGrid is Fun",
  //     text: "and easy to do anywhere, even with Node.js",
  //     html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  //   };

  await sgMail.send(msg);

  res.status(201).json({
    status: "success",
    message:
      "Account created successfully! The invitation email has been sent.",
  });
});

// exports.create = catchAsync(async (req, res, next) => {
//   const { first_name, last_name, email, role } = req.body;

//   // Check if user already exists
//   const existingUser = await Account.findOne({ email });
//   if (existingUser) {
//     return next(new AppError("Account with this email already exists!", 400));
//   }

//   // Create invite token
//   const inviteToken = crypto.randomBytes(32).toString("hex");
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(inviteToken)
//     .digest("hex");

//   // Create new user (inactive, no password yet)
//   const newUser = await Account.create({
//     first_name,
//     last_name,
//     email,
//     role: role || "user",
//     inviteToken: hashedToken,
//     inviteTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
//     active: false, // Account is inactive until they claim account
//   });

//   console.log("API Key:", process.env.SENDGRID_API_KEY);
//   const msg = {
//     to: "jcianci1@gmail.com", // Change to your recipient
//     from: "jarred.cianciulli@jcianci.io", // Change to your verified sender
//     subject: "Sending with SendGrid is Fun",
//     text: "and easy to do anywhere, even with Node.js",
//     html: "<strong>and easy to do anywhere, even with Node.js</strong>",
//   };
//   console.log(msg);
//   sgMail
//     .send(msg)
//     .then(() => {
//       console.log("Email sent");
//     })
//     .catch((error) => {
//       console.error(error);
//     });

//   // Send invite email
//   const inviteLink = `${req.protocol}://${req.get(
//     "host"
//   )}/claim-account?token=${inviteToken}`;
//   // await sendEmail({
//   //   email: newUser.email,
//   //   subject: "You're Invited! Claim Your Account",
//   //   message: `Hello ${newUser.first_name},\n\nYou've been invited to join. Click the link below to claim your account:\n\n${inviteLink}\n\nThis link will expire in 24 hours.\n\nBest,\nYour Team`,
//   // });

//   res.status(201).json({
//     status: "success",
//     message: "Account created succesfully! The welcome email has been sent",
//   });
// });
