const express = require('express');
const viewsController = require('../controllers/viewsController');
// const userController = require('./../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get(
  '/all-courses',
  authController.isLoggedIn,
  viewsController.getCourseOverview
);

router.get(
  '/private-lessons-registration',
  authController.isLoggedIn,
  viewsController.privateRegistration
);

router.get(
  '/studio/:slug',
  authController.isLoggedIn,
  viewsController.getStudio
);

router.get(
  '/course/:slug',
  authController.isLoggedIn,
  viewsController.getCourse
);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);

router.get('/me', authController.protect, viewsController.getDashboard);
router.get(
  '/my-bookings',
  authController.protect,
  viewsController.getMyRegistrations
);
router.get('/my-calendar', authController.protect, viewsController.getCalendar);
router.get(
  '/my-calendar-data',
  authController.protect,
  viewsController.getCalendarData
);
router.get('/my-settings', authController.protect, viewsController.getSettings);
router.get('/my-billing', authController.protect, viewsController.getBilling);
router.get('/my-reviews', authController.protect, viewsController.getReviews);

router.get('/my-studios', authController.protect, viewsController.getMyStudios);
router.get('/my-courses', authController.protect, viewsController.getMyCourses);
router.get(
  '/my-messages',
  authController.protect,
  viewsController.getMyMessages
);

router.get(
  '/my-chatroom',
  authController.protect,
  viewsController.getMyChatroom
);
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

// Protect all routes after this middleware
router.use(authController.protect);

router.use(authController.restrictTo('owner', 'instructor-all'));

router.get(
  '/my-messages',
  authController.protect,
  viewsController.getMyMessages
);

router.get(
  '/my-live-classes',
  authController.protect,
  viewsController.getMyLiveClasses
);

router.get(
  '/my-private-lessons',
  authController.protect,
  viewsController.getMyPrivateLessons
);

router.get('/my-courses', authController.protect, viewsController.getMyCourse);

router.get(
  '/my-instructor-billing',
  authController.protect,
  viewsController.getMyCourse
);

router.use(authController.restrictTo('owner'));

router.get(
  '/manage-messages',
  authController.protect,
  viewsController.getAllMessages
);

router.get(
  '/manage-studios',
  authController.protect,
  viewsController.getAllStudios
);

router.get(
  '/manage-courses',
  authController.protect,
  viewsController.getAllCourses
);

router.get(
  '/manage-course/:slug/edit',
  authController.isLoggedIn,
  viewsController.getCourseEdit
);

// MANAGE MUSIC GROUPS
router.get('/manage-music-groups/:slug', viewsController.getGroupMusicSummary);
router.get(
  '/manage-music-groups/:slug/update_details',
  viewsController.getGroupMusicDetailsUpdate
);
router.get(
  '/manage-music-groups/:slug/update_enrollment_info',
  viewsController.getGroupMusicEnrollmentInfoUpdate
);

router.get(
  '/manage-music-groups/:slug/update_images',
  viewsController.getGroupMusicImagesUpdate
);

router.get(
  '/manage-music-groups/:slug/info',
  viewsController.getGroupMusicInfo
);
router.get(
  '/manage-music-groups/:slug/settings',
  viewsController.getGroupMusicSettings
);

router
  .route('/:slug/sessions-overview/:id')
  .get(authController.protect, viewsController.getGroupMusicSessionOverviews);

router
  .route('/:slug/sessions-overview/:id/details')
  .get(
    authController.protect,
    viewsController.getGroupMusicSessionOverviewsDetails
  );

router
  .route('/:slug/sessions-overview/:id/enrollment')
  .get(
    authController.protect,
    viewsController.getGroupMusicSessionOverviewsEnrollment
  );
router
  .route('/:slug/sessions-overview/:id/settings')
  .get(
    authController.protect,
    viewsController.getGroupMusicSessionOverviewsSettings
  );

router
  .route('/:slug/sessions-overview/:id/update')
  .get(
    authController.protect,
    viewsController.getGroupMusicSessionOverviewsUpdate
  );

router.get(
  '/manage-music-groups/:slug/sessions',
  viewsController.getGroupMusicEditSessions
);

router.get(
  '/manage-music-groups/:slug/sessions/create',
  authController.protect,
  viewsController.getGroupMusicOverviewCreateSessions
);

// MANAGE MUSIC GROUP SESSION

router.get(
  '/:slug/sessions-overview/session/:id/info',
  authController.protect,
  viewsController.getGroupMusicSessionInfo
);

router.get(
  '/:slug/sessions-overview/session/:id/settings',
  authController.protect,
  viewsController.getGroupMusicSessionSettings
);

router.get(
  '/:slug/sessions-overview/session/:id/update',
  authController.protect,
  viewsController.getGroupMusicSessionUpdate
);

router.get(
  '/:slug/sessions-overview/:id/timing/update',
  authController.protect,
  viewsController.getGroupMusicSessionOverviewsTimingUpdate
);
router.get(
  '/:slug/sessions-overview/:id/enrollment/update',
  authController.protect,
  viewsController.getGroupMusicSessionOverviewsEnrollmentUpdate
);
router.get(
  '/:slug/sessions-overview/:id/details/update',
  authController.protect,
  viewsController.getGroupMusicSessionOverviewsDetailspdate
);
router.get(
  '/:slug/sessions-overview/:id/location/update',
  authController.protect,
  viewsController.getGroupMusicSessionOverviewsLocationUpdate
);

router.get(
  '/:slug/sessions-overview/session/:id/create',
  authController.protect,
  viewsController.getGroupMusicSessionCreate
);

router.get(
  '/:slug/sessions-overview/session/:id/update',
  authController.protect,
  viewsController.getGroupMusicSessionInfo
);

router.get(
  '/manage-music-groups',
  authController.protect,
  viewsController.getAllMusicGroups
);

router.get(
  '/manage-music-group-create',
  authController.protect,
  viewsController.postGroupMusic
);

router.get(
  '/manage-live-classes',
  authController.protect,
  viewsController.getAllLiveClasses
);

router.get(
  '/manage-employees',
  authController.protect,
  viewsController.getAllEmployees
);

router.get(
  '/manage-bookings',
  authController.protect,
  viewsController.getAllBookings
);

router.get(
  '/manage-users',
  authController.protect,
  viewsController.getAllUsers
);

router.get(
  '/manage-reviews',
  authController.protect,
  viewsController.getAllReviews
);

router.get(
  '/manage-billing',
  authController.protect,
  viewsController.getAllBilling
);

module.exports = router;
