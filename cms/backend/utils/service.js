const axios = require("axios");
const qs = require("qs");
const User = require("../models/userModel");
const { updateBooking } = require("../controllers/bookingController");

async function getGoogleOAuthTokens(code) {
  console.log("HIHI");

  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_SECRET,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    grant_type: "authorization_code",
  };
  console.log(values);
  console.log(qs.stringify(values));
  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
}

async function getGoogleUser(id_token, access_token) {
  console.log(id_token, "ID TOKEN");
  console.log(access_token, "ACCESS TOKEN");
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error.message);
    log.error(error, "Error fetching Google user");
    throw new Error(error.message);
  }
}

async function findOrCreateUser(email, update, options) {
  try {
    console.log(email);
    const user = await User.findOne(email);
    console.log("existing user", user);

    if (!user) {
      update = {
        ...update,
        googleOAuthCreated: true,
      };
      let newUser;
      newUser = await User.create(update);
      console.log("new user", newUser);
      return newUser;
    } else {
      return user;
    }
  } catch (err) {
    console.log(err);
  }
}

exports.getGoogleOAuthTokens = getGoogleOAuthTokens;
exports.getGoogleUser = getGoogleUser;
exports.findOrCreateUser = findOrCreateUser;
