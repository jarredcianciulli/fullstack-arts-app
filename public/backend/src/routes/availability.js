const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const moment = require("moment");

// Initialize Google OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT_URL
);

// Set initial credentials with the refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Middleware to refresh the access token if needed
async function refreshAccessTokenIfNeeded() {
  try {
    console.log("Refreshing access token...");
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    console.log(
      "Access token refreshed successfully:",
      credentials.access_token
    );

    // Optionally, update the access token in your environment or database
    process.env.GOOGLE_ACCESS_TOKEN = credentials.access_token;
  } catch (error) {
    console.error(
      "Error refreshing access token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to refresh access token");
  }
}

// Route to check availability for a specific date
router.get("/check-date/:date", async (req, res) => {
  try {
    await refreshAccessTokenIfNeeded(); // Ensure the access token is valid

    const date = req.params.date;
    const startOfDay = moment(date).startOf("day").toISOString();
    const endOfDay = moment(date).endOf("day").toISOString();

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startOfDay,
        timeMax: endOfDay,
        items: [{ id: process.env.CALENDAR_ID }],
      },
    });

    const busySlots = response.data.calendars[process.env.CALENDAR_ID].busy.map(
      (slot) => ({
        start: moment(slot.start).format("HH:mm"),
        end: moment(slot.end).format("HH:mm"),
      })
    );

    console.log("Busy slots for", date, ":", busySlots);
    res.json({ busySlots });
  } catch (error) {
    console.error(
      "Error checking availability:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to check availability" });
  }
});

// Route to check availability for a specific time slot
router.get("/check-slot", async (req, res) => {
  try {
    await refreshAccessTokenIfNeeded(); // Ensure the access token is valid

    const { date, startTime } = req.query;

    // Convert date and time to ISO string
    const startDateTime = moment(
      `${date} ${startTime}`,
      "YYYY-MM-DD HH:mm"
    ).toISOString();
    const endDateTime = moment(startDateTime).add(45, "minutes").toISOString();

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDateTime,
        timeMax: endDateTime,
        items: [{ id: process.env.CALENDAR_ID }],
      },
    });

    const busySlots = response.data.calendars[process.env.CALENDAR_ID].busy;
    const isAvailable = busySlots.length === 0;

    console.log(`Availability for ${date} at ${startTime}:`, isAvailable);
    res.json({ isAvailable });
  } catch (error) {
    console.error(
      "Error checking time slot:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to check time slot" });
  }
});

module.exports = router;
