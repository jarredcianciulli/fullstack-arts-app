const multer = require("multer");
// const sharp = require('sharp');
const User = require("../models/userModel");
const UserSession = require("../models/userSessionModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const { createSendTokens } = require("../utils/jwt");
const {
  getGoogleOAuthTokens,
  getGoogleUser,
  findOrCreateUser,
} = require("../utils/service");
const jwt = require("jsonwebtoken");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new AppError('Not an image! Please upload only images.', 400), false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter
// });

// exports.uploadUserPhoto = upload.single('photo');

// exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/users/${req.file.filename}`);

//   next();
// });

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
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

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

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.googleOAuthHandler = catchAsync(async (req, res) => {
  try {
    // get code from query string
    const code = req.query.code;

    // get the id and access token with the code
    const googleTokens = await getGoogleOAuthTokens(code);

    // get user with tokens
    // const googleUser = jwt.decode(googleTokens.id_token);
    const googleUser = await getGoogleUser(
      googleTokens.id_token,
      googleTokens.access_token
    );

    if (!googleUser.verified_email) {
      return res.status(403).send("Google account is not verified.");
    }

    // upsert user
    const upsertUser = await findOrCreateUser(
      { email: googleUser.email },
      {
        email: googleUser.email,
        picture: googleUser.picture,
        name: googleUser.name,
        googleOAuthCreated: true,
        password: googleTokens.id_token,
        passwordConfirm: googleTokens.id_token,
        emailVerified: googleUser.verified_email,
      }
    );

    // create access and refresh tokens
    // create an access token

    const token1Expiration = new Date(
      Date.now() +
        process.env.JWT_ACCESS_TOKEN_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // 90 days
    );
    const token2Expiration = new Date(
      Date.now() +
        process.env.JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // 1 year
    );

    const tokens = await createSendTokens(
      token1Expiration,
      token2Expiration,
      upsertUser,
      200,
      req,
      res
    );
    console.log(tokens);

    // create session
    if (upsertUser.emailVerified && tokens.token1 && tokens.token2) {
      // console.log(req.cookies.j_cianciulli_access);
      // const findSession = await UserSession.find({
      //   accessToken: req.cookies.j_cianciulli_access,
      //   refreshToken: req.cookies.j_cianciulli_rfsh,
      // });
      // console.log("find sessions", findSession);
      const sessionLookup = await UserSession.create({
        userId: upsertUser.id,
        accessToken: tokens.token1,
        accessTokenExpiresAt: token1Expiration,
        refreshToken: tokens.token2,
        refreshTokenExpiresAt: token2Expiration,
      });
      console.log("createSession", sessionLookup);
    } else {
      return "Email not verified!  Please verify your email";
    }

    // set cookies

    // redirect back to client
    return res.redirect("http://localhost:3001/");
  } catch (err) {
    console.log(err);
    res.redirect("http://localhost:3001/");
  }
});
