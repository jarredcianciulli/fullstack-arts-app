const express = require("express");
const enrollmentsController = require("../controllers/enrollmentsController");
const accountAuthController = require("../controllers/accountAuthController");

const router = express.Router();

router
  .route("/get-all/:id")
  .get(accountAuthController.protect, enrollmentsController.getAllEnrollments);

router
  .route("/:id")
  .get(enrollmentsController.getEnrollment)
  .patch(accountAuthController.protect, enrollmentsController.updateEnrollment)
  .delete(
    accountAuthController.protect,
    accountAuthController.restrictTo("admin", "owner"),
    enrollmentsController.deleteEnrollment
  );

// ✅ Use JSON parser for normal routes
router.post(
  "/create",
  express.json(),
  enrollmentsController.createCheckoutSession
);

// ✅ Use raw body parser ONLY for the webhook route
router.post(
  "/verify",
  express.raw({ type: "application/json" }),
  enrollmentsController.stripeWebhook
);

module.exports = router;
