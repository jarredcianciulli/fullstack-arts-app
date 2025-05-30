const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const moment = require("moment");
const readline = require("readline");

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

// Add this near your other route handlers
router.get("/oauth2callback", async (req, res) => {
  const { code, error } = req.query;
  console.log("OAuth Callback - Code:", code, "Error:", error);

  if (error) {
    console.error("OAuth Error:", error);
    return res.status(400).send(`OAuth Error: ${error}`);
  }

  if (!code) {
    return res.status(400).send("Authorization code is required");
  }

  try {
    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken({
      code: code,
      redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    });

    console.log("Successfully obtained tokens:", tokens);

    // Store tokens
    oauth2Client.setCredentials(tokens);
    process.env.GOOGLE_ACCESS_TOKEN = tokens.access_token;
    if (tokens.refresh_token) {
      process.env.GOOGLE_REFRESH_TOKEN = tokens.refresh_token;
    }

    res.send("Authentication successful! You can close this window.");
  } catch (err) {
    console.error("Error getting tokens:", err);
    res.status(500).send(`Error: ${err.message}`);
  }
});

// Add this near your other route handlers
router.get("/users/google-signup", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code is required" });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Successfully obtained tokens:", tokens);

    // Store these tokens in your database or session
    oauth2Client.setCredentials(tokens);

    // Return the tokens to the frontend (in production, use HTTP-only cookies)
    res.json({
      success: true,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
  } catch (error) {
    console.error("Error getting tokens:", error);
    res.status(500).json({
      error: "Authentication failed",
      details: error.message,
    });
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

// API endpoint to check session availability
router.post("/check-session-availability", async (req, res) => {
  try {
    const { day, time, cadenceType, numberOfSessions } = req.body;
    console.log("Received scheduling request:", req.body);

    // Get the availability organization data
    const availabilityOrg = getAvailabilityOrganization();

    // Get minimum notice hours
    const activeOrg = availabilityOrg.find((org) => org.active);
    if (!activeOrg) {
      return res.status(404).json({ error: "No active organization found" });
    }

    const minNoticeHours = activeOrg.minimum_notice_hours || 4;
    console.log("Using minimum notice hours:", minNoticeHours);

    // Generate recurring sessions with proper time calculations
    const result = await generateAvailableSessions(
      day,
      time,
      cadenceType,
      numberOfSessions,
      minNoticeHours
    );

    // Include minNoticeHours in response so frontend knows the constraint
    // Generate status message for unavailable sessions with detailed information
    let statusMessage = "";
    if (result.unavailableSessionsCount > 0) {
      // Get information about the first unavailable session
      const firstUnavailable = result.unavailableSessions[0];

      // Get information about the last available session (which was added as an alternative)
      const lastAvailable =
        result.availableSessions[result.availableSessions.length - 1];

      statusMessage = `All sessions were not consecutively available. ${firstUnavailable.date} was not available, so another session was added on ${lastAvailable.date} to accommodate. If you prefer to reschedule this that week instead, feel free to update that date using the calendar icon.`;
    }

    const response = {
      ...result,
      minNoticeHours: minNoticeHours, // Add the minimum notice hours to the response
      statusMessage: statusMessage, // Add the status message for frontend to display
    };

    console.log("Sending availability result:", {
      availableSessions: result.availableSessions.length,
      unavailableSessions: result.unavailableSessions.length,
      minNoticeHours: minNoticeHours,
    });
    console.log(response);
    res.json(response);
  } catch (error) {
    console.error("Error checking session availability:", error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to get availability organization data
function getAvailabilityOrganization() {
  // This would typically fetch from database, but for now we'll use a static object
  // matching the structure in your frontend JSON
  return [
    {
      id: 1,
      availability: [
        {
          day: "Monday",
          start_hour: 10,
          start_minutes: 30,
          end_hour: 24,
          end_minutes: 30,
        },
        {
          day: "Tuesday",
          start_hour: 9,
          start_minutes: 30,
          end_hour: 20,
          end_minutes: 30,
        },
        {
          day: "Wednesday",
          start_hour: 9,
          start_minutes: 30,
          end_hour: 20,
          end_minutes: 30,
        },
        {
          day: "Thursday",
          start_hour: 9,
          start_minutes: 30,
          end_hour: 20,
          end_minutes: 30,
        },
      ],
      minimum_notice_hours: 4,
      date_range: {
        type: "within calendar days",
        calendar_days: 60,
      },
      start_time_increments_minutes: 15,
      temporary_availability: true,
      start_date: "2024-06-27T00:00:00.000Z",
      end_date: "2024-09-15T00:00:00.000Z",
      active: true,
    },
  ];
}

// Helper function to generate available sessions
async function generateAvailableSessions(
  day,
  time,
  cadenceType,
  numberOfSessions,
  minNoticeHours
) {
  // Ensure the access token is valid
  await refreshAccessTokenIfNeeded();
  const moment = require("moment");
  console.log("Generating sessions for:", {
    day,
    time,
    cadenceType,
    numberOfSessions,
    minNoticeHours,
  });

  const availableSessions = [];
  const unavailableSessions = [];
  let unavailableSessionsCount = 0;

  // Current time for comparison
  const now = moment();
  console.log("Current time:", now.format("YYYY-MM-DD HH:mm:ss"));

  // Find the next occurrence of the specified day
  let currentDate = moment();
  while (currentDate.format("dddd") !== day) {
    currentDate.add(1, "day");
  }

  // Set up time for potential first session
  const timeMoment = moment(time, "h:mm A");
  let firstSessionDateTime = moment(currentDate).set({
    hour: timeMoment.hour(),
    minute: timeMoment.minute(),
    second: 0,
    millisecond: 0,
  });

  // Check if first session is within minimum notice period
  const hoursUntilFirstSession = firstSessionDateTime.diff(now, "hours", true);

  console.log(
    "First session time:",
    firstSessionDateTime.format("YYYY-MM-DD HH:mm:ss")
  );
  console.log("Hours until first session:", hoursUntilFirstSession.toFixed(2));
  console.log("Minimum notice required:", minNoticeHours);

  if (hoursUntilFirstSession < minNoticeHours) {
    // First session is too soon, mark as unavailable and advance
    console.log(
      "First session is within minimum notice period, marking as unavailable"
    );
    unavailableSessions.push({
      day: currentDate.format("dddd"),
      date: currentDate.format("YYYY-MM-DD"),
      time: time,
      reason: `Within minimum notice period of ${minNoticeHours} hours (${hoursUntilFirstSession.toFixed(
        2
      )} hours until session)`,
    });
    unavailableSessionsCount++;

    // Advance to next occurrence
    const advanceDays = cadenceType === "Bi-weekly" ? 14 : 7;
    currentDate.add(advanceDays, "days");
  }

  // Generate remaining sessions based on cadence
  let generatedCount = 0;
  let attemptCount = 0;
  const maxAttempts = numberOfSessions * 4; // Buffer for unavailable slots

  while (generatedCount < numberOfSessions && attemptCount < maxAttempts) {
    attemptCount++;
    const sessionDate = currentDate.clone();
    const sessionDateTime = moment(sessionDate).set({
      hour: timeMoment.hour(),
      minute: timeMoment.minute(),
      second: 0,
      millisecond: 0,
    });

    // Check if this session is within minimum notice period
    const hoursUntilSession = sessionDateTime.diff(now, "hours", true);
    let isAvailable = true;

    if (hoursUntilSession < minNoticeHours) {
      console.log(
        `Session on ${sessionDate.format(
          "YYYY-MM-DD"
        )} at ${time} is within minimum notice period`
      );
      isAvailable = false;
    }

    // Check Google Calendar availability if session is still potentially available
    if (isAvailable) {
      try {
        // Calculate the start and end times for this session
        const sessionStartTime = sessionDateTime.clone();
        // Assuming sessions are 1 hour long - adjust as needed based on your service duration
        const sessionEndTime = sessionDateTime.clone().add(1, "hour");

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        const response = await calendar.freebusy.query({
          requestBody: {
            timeMin: sessionStartTime.toISOString(),
            timeMax: sessionEndTime.toISOString(),
            items: [{ id: process.env.CALENDAR_ID }],
          },
        });

        const busySlots = response.data.calendars[process.env.CALENDAR_ID].busy;

        // If there are any busy slots that overlap with our session time, mark as unavailable
        if (busySlots && busySlots.length > 0) {
          console.log(
            `Session on ${sessionDate.format(
              "YYYY-MM-DD"
            )} at ${time} conflicts with existing calendar event`
          );
          isAvailable = false;

          // Add to unavailable sessions with reason
          unavailableSessions.push({
            day: sessionDate.format("dddd"),
            date: sessionDate.format("YYYY-MM-DD"),
            time: time,
            reason: "Conflicts with existing appointment",
          });
          unavailableSessionsCount++;
        }
      } catch (error) {
        console.error(
          "Error checking Google Calendar availability:",
          error.response?.data || error.message
        );
        // If there's an error checking availability, assume the slot is unavailable to be safe
        isAvailable = false;
      }
    }

    if (isAvailable) {
      // Session is available
      availableSessions.push({
        day: sessionDate.format("dddd"),
        date: sessionDate.format("YYYY-MM-DD"),
        time: time,
      });
      generatedCount++;
    } else {
      // Session is unavailable
      unavailableSessions.push({
        day: sessionDate.format("dddd"),
        date: sessionDate.format("YYYY-MM-DD"),
        time: time,
        reason: `Within minimum notice period of ${minNoticeHours} hours`,
      });
      unavailableSessionsCount++;
    }

    // Advance to next date based on cadence
    const advanceDays = cadenceType === "Bi-weekly" ? 14 : 7;
    currentDate.add(advanceDays, "days");
  }

  return {
    availableSessions,
    unavailableSessions,
    unavailableSessionsCount,
  };
}

// Test the token
async function testAuth() {
  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const response = await calendar.calendarList.list();
    console.log(
      "Calendars:",
      response.data.items.map((c) => c.summary)
    );
  } catch (error) {
    console.error("Auth test failed:", error.message);
    console.error("Error details:", error.response?.data);
  }
}

testAuth();

const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

// Generate the URL for OAuth consent
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  prompt: "consent", // Force to get refresh token
  redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
});

console.log("Authorize this app by visiting this URL:", authUrl);

// Set up to read the authorization code
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the code from that page here: ", async (code) => {
  rl.close();

  try {
    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tokens:", JSON.stringify(tokens, null, 2));

    // Test the tokens
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const res = await calendar.calendarList.list();
    console.log(
      "Calendars:",
      res.data.items.map((c) => c.summary)
    );
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Details:", error.response?.data);
  }
});

module.exports = router;
