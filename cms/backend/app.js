const path = require("path");
const express = require("express");
const http = require("http");
const morgan = require("morgan");
// const rateLimit = require('express-rate-limit');
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const methodOverride = require("method-override");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const studioRouter = require("./routes/studioRoutes");
const courseRouter = require("./routes/courseRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const reserveRouter = require("./routes/reserveRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const registerRouter = require("./routes/registerRoutes");
const musicRouter = require("./routes/departments/musicOperationsRoutes");
const availabilityExceptionRouter = require("./routes/availabilityExceptionRoutes");
const availabilityRouter = require("./routes/availabilityRoutes");
const instructorSettingsRouter = require("./routes/instructorSettingsRoutes");
const bookingController = require("./controllers/bookingController");
const registerController = require("./controllers/registerController");
const formRouter = require("./routes/formRoutes");

// Start express app
const app = express();

app.enable("trust proxy");

const serve = http.createServer(app);

// 1) GLOBAL MIDDLEWARES
// Implement CORS

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Set the allowed origin(s) here
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:8080",
      "http://localhost:8081",
    ], // Replace 3000 with the port of your React app
  })
);
// Access-Control-Allow-Origin *
// api.natours.com, front-end natours.com
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))

app.options("*", cors());
// app.options('/api/v1/tours/:id', cors());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP headers
app.use(helmet({ crossOriginEmbedderPolicy: false, originAgentCluster: true }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data: blob:"],
    },
  })
);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);

// Stripe webhook, BEFORE body-parser, because stripe needs the body as stream

app.post(
  "/checkout",
  bodyParser.raw({ type: "application/json" }),
  bookingController.webhookCheckout
);

app.post(
  "/checkout",
  bodyParser.raw({ type: "application/json" }),
  registerController.webhookCheckout
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

app.use(methodOverride("_method"));

// 3) ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/reserve", reserveRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/studios", studioRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/music", musicRouter);
app.use("/api/v1/register", registerRouter);
app.use("/registration", formRouter);
// app.use('/api/v1/availability-exception', availabilityExceptionRouter);
app.use("/api/v1/availability", availabilityRouter);
app.use("/api/v1/instructor-settings", instructorSettingsRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = { app, serve };
