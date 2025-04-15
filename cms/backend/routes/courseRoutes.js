const express = require("express");
const courseController = require("../controllers/courseController");
const sessionsOverviewController = require("../controllers/sessionsOverviewController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

router
  .route("/delete/:id")
  // .get(courseController.getCourse)
  .delete(
    // console.log('hello'),
    authController.protect,
    authController.restrictTo("admin", "owner"),
    courseController.deleteCourse
  );

router
  .route("/get-all")
  // .get(courseController.getCourse)
  .get(
    // console.log('hello'),
    authController.protect,
    authController.restrictTo("admin", "owner"),
    courseController.getAllCourses
  );

// router.param('id', tourController.checkID);

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews

router.use("/:courseId/reviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(courseController.aliasTopCourses, courseController.getAllCourses);

router.route("/course-stats").get(courseController.getCourseStats);
router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "instructor", "owner"),
    courseController.getMonthlyPlan
  );

router
  .route("/courses-within/:distance/center/:latlng/unit/:unit")
  .get(courseController.getCoursesWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router
  .route("/distances/:latlng/unit/:unit")
  .get(courseController.getDistances);

router.route("/create-course").get(courseController.getAllCourses).post(
  authController.protect,
  authController.restrictTo("admin", "owner", "lead-admin"),
  // courseController.uploadCourseImages,
  // courseController.resizeCourseImages,
  courseController.createCourse
);

router
  .route("/:id")
  .get(courseController.getCourse)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "owner"),
    // courseController.uploadCourseImages,
    // courseController.resizeCourseImages,
    courseController.updateCourse
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "owner"),
    courseController.deleteCourse
  );
router
  .route("/sessions-overview/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin", "owner"),
    sessionsOverviewController.getGroupMusicSessionsOverview
  );
// .patch(
//   authController.protect,
//   authController.restrictTo(
//     'admin',
//     'owner',
//     'lead-admin',
//     sessionsOverviewController.createSessionsOverview
//   )
// );

//getGroupMusicSessionOverviews
router
  .route("/sessions-overview/create")
  .post(
    authController.protect,
    authController.restrictTo("admin", "owner", "lead-admin"),
    sessionsOverviewController.createSessionsOverview
  );

module.exports = router;
