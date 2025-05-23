const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Set allowed origins for CORS
const allowedOrigins = [
  "https://www.intonobyjarred.com",
  "http://localhost:3000", // add this for local dev if needed
];

// CORS middleware with origin check
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin, like mobile apps or curl requests
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if using cookies or authentication
  })
);

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Webhook route (handles raw body parsing internally)
app.use("/api/webhook", require("./src/routes/webhook"));
app.use(express.json());

// Routes
const availabilityRoutes = require("./routes/availability");
const locationRoutes = require("./routes/location");
const paymentRoutes = require("./src/routes/payment");
const configRoutes = require("./src/routes/config");
const bookingRoutes = require("./src/routes/booking");

console.log("Setting up routes...");
app.use("/api/availability", availabilityRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/config", configRoutes);
app.use("/api/bookings", bookingRoutes);
console.log("Routes set up successfully");

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Available routes:");
  console.log("- /api/availability/*");
  console.log("- /api/location/*");
  console.log("- /api/payment/*");
  console.log("- /api/config/*");
  console.log("- /api/bookings/*");
  console.log("- /api/webhook/*");
});
