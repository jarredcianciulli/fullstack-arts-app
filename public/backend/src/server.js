const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../config.env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Dynamic CORS configuration
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://www.intonobyjarred.com",
        "http://www.intonobyjarred.com",
        "http://www.intonobyjarred.com.s3-website-us-east-1.amazonaws.com",
        "https://intonobyjarred.com",
        "http://intonobyjarred.com",
      ] // Production frontend domains
    : ["http://localhost:3000", "http://localhost:3001", "http://localhost:8081"]; // Development origins

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(null, true); // Still allow for now, but log it for debugging
        // Eventually change to: callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Fallback CORS for debugging - comment this out in production
// app.use(
//   cors({
//     origin: "*", // Allow all origins
//     credentials: true, // Allow cookies or authentication headers
//   })
// );

// Middleware
app.use(express.json());

// Import routes
const registrationRoutes = require("./routes/registration");
const paymentRoutes = require("./routes/payment");
const locationRoutes = require("./routes/location");
const availabilityRoutes = require("./routes/availability");
const configRoutes = require("./routes/config"); // Import config routes

// Use routes
app.use("/api/registration", registrationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/config", configRoutes); // Use config routes

// MongoDB connection
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
