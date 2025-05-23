const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://www.intonobyjarred.com",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("CORS origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        console.log("CORS allowed for:", origin);
        callback(null, true);
      } else {
        console.log("CORS blocked for:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    res.status(403).json({ error: "CORS error: Origin not allowed" });
  } else {
    next(err);
  }
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/api/cors-test", (req, res) => {
  res.json({ message: "CORS is working!" });
});

app.use("/api/webhook", require("./src/routes/webhook"));
app.use(express.json());

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
