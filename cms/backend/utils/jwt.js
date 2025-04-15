const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendTokens = (
  token1Expiration,
  token2Expiration,
  user,
  statusCode,
  req,
  res
) => {
  const refreshToken = crypto.randomBytes(64).toString("hex");
  const token1 = signToken(user._id);
  const token2 = signToken(refreshToken);

  res.cookie("j_cianciulli_access", token1, {
    expires: token1Expiration,
    httpOnly: true,
    // secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    secure: true,
  });

  res.cookie("j_cianciulli_rfsh", token2, {
    expires: token2Expiration,
    httpOnly: true,
    // secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    secure: true,
  });

  // Remove password from output
  user.password = undefined;

  const tokens = { token1, token2 };

  return tokens;
};

exports.createSendTokens = createSendTokens;
