const express = require("express");
const musicOperationsController = require("../../controllers/departments/musicOperationsController");
const authController = require("../../controllers/authController");
const reviewRouter = require("./../../routes/reviewRoutes");
const multer = require("multer");

const router = express.Router();

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage }); // Accept single file with field name 'file'

router
  .route("/delete/:id")
  .delete(
    authController.protect,
    authController.restrictTo("admin", "owner"),
    musicOperationsController.deleteGroupMusic
  );

// router
//   .route("/policy/:id")
//   .get(musicOperationsController.downloadPDFGroupMusic);

router
  .route("/get-all")
  .get(
    authController.protect,
    authController.restrictTo("admin", "owner"),
    musicOperationsController.getAllGroupMusic
  );
router
  .route("/:id/get-all")
  .get(
    authController.protect,
    authController.restrictTo("admin", "owner"),
    musicOperationsController.getAllGroupMusicClasses
  );

router.use("/:id/reviews", reviewRouter);

router
  .route("/create-group")
  .get(musicOperationsController.getAllGroupMusic)
  .post(
    authController.protect,
    authController.restrictTo("admin", "owner", "lead-admin"),
    musicOperationsController.uploadHandler,
    musicOperationsController.createGroupMusic
    // musicOperationsController.pdfFileGroupMusicUpload
    // musicOperationsController.resizeCourseImages,
  );

router
  .route("/private-requests")
  .get(musicOperationsController.getAllPrivateLessonsRequest);

router
  .route("/create-class")
  .get(musicOperationsController.getAllGroupMusic)
  .post(
    authController.protect,
    authController.restrictTo("admin", "owner", "lead-admin"),
    // musicOperationsController.uploadCourseImages,
    // musicOperationsController.uploadGroupMusicMultipleFiles,
    // musicOperationsController.resizeCourseImages,
    musicOperationsController.createGroupMusicClass
  );

router
  .route("/:id")
  .get(musicOperationsController.getGroupMusic)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "owner"),
    // musicOperationsController.pdfFileGroupMusicUpload,
    // musicOperationsController.resizeCourseImages,
    musicOperationsController.updateGroupMusic
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "owner"),
    musicOperationsController.deleteGroupMusic
  );

router
  .route("class/:id")
  .get(musicOperationsController.getGroupMusicClass)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "owner"),
    // musicOperationsController.uploadCourseImages,
    // musicOperationsController.resizeCourseImages,
    musicOperationsController.updateGroupMusicClass
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "owner"),
    musicOperationsController.deleteGroupMusicClass
  );

module.exports = router;
