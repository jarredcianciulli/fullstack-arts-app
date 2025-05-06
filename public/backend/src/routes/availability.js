const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const moment = require("moment");

// Initialize Google Calendar API with OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT_URL
);

// Initialize calendar with OAuth2 client
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// Set credentials
oauth2Client.setCredentials({
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Check if a specific date has any available time slots
router.get("/check-date/:date", async (req, res) => {
  try {
    const date = req.params.date;
    const startOfDay = moment(date).startOf("day").toISOString();
    const endOfDay = moment(date).endOf("day").toISOString();

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startOfDay,
        timeMax: endOfDay,
        items: [{ id: process.env.CALENDAR_ID }],
      },
    });

    // Get busy slots and convert them to local time
    const busySlots = response.data.calendars[process.env.CALENDAR_ID].busy.map(
      (slot) => ({
        start: moment(slot.start).format("HH:mm"),
        end: moment(slot.end).format("HH:mm"),
      })
    );

    console.log("Busy slots for", date, ":", busySlots);
    res.json({ busySlots });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ error: "Failed to check availability" });
  }
});

// Check availability for a specific time slot
router.get("/check-slot", async (req, res) => {
  try {
    const { date, startTime } = req.query;

    // Convert date and time to ISO string
    const startDateTime = moment(
      `${date} ${startTime}`,
      "YYYY-MM-DD HH:mm"
    ).toISOString();
    const endDateTime = moment(`${date} ${startTime}`, "YYYY-MM-DD HH:mm")
      .add(45, "minutes")
      .toISOString();

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDateTime,
        timeMax: endDateTime,
        items: [{ id: process.env.CALENDAR_ID }],
      },
    });

    const busySlots = response.data.calendars[process.env.CALENDAR_ID].busy;
    const isAvailable = busySlots.length === 0;

    res.json({ isAvailable });
  } catch (error) {
    console.error("Error checking time slot:", error);
    res.status(500).json({ error: "Failed to check time slot" });
  }
});

module.exports = router;
