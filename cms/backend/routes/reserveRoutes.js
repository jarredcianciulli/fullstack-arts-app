const express = require("express");
const sectionController = require("../controllers/reserve/sectionsController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/delete/:id")
  .delete(
    authController.protect,
    authController.restrictTo("admin", "owner"),
    sectionController.deleteSections
  );

router
  .route("/get-all")
  .get(
    authController.protect,
    authController.restrictTo("admin", "owner"),
    sectionController.getAllSections
  );

router
  .route("/create-section")
  .post(
    authController.protect,
    authController.restrictTo("admin", "owner", "lead-admin"),
    sectionController.uploadHandler,
    sectionController.createSections
  );

router
  .route("/:id")
  .get(sectionController.getSections)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "owner"),
    sectionController.uploadHandler,
    sectionController.updateSections
  );

module.exports = router;
