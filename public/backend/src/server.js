const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../config.env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://www.intonobyjarred.com"] // Replace with your production domain
    : ["http://localhost:3000", "http://localhost:3001"]; // Development origins

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

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
mongoose
  .connect(process.env.DATABASE_URL || "mongodb://localhost:27017/soundworks", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
