const Studio = require('../models/studioModel');
const Course = require('../models/courseModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Registration = require('../models/registrationModel');
const Availability = require('../models/availabilityModel');
const SessionsOverview = require('../models/sessionsOverviewModel');
const Message = require('../models/messageModel');
const Sessions = require('../models/sessionsModel');
const managementFactory = require('./handlerManagementFactory');
const catchAsync = require('../utils/catchAsync');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const studios = await Studio.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('studio-overview', {
    title: 'All Studios',
    studios
  });
});

exports.getStudio = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const studio = await Studio.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!studio) {
    return next(new AppError('There is no studio with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('studio', {
    title: `${studio.courseName}, Studio`,
    studio
  });
});

exports.getCourse = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const course = await Course.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!course) {
    return next(new AppError('There is no course with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('course', {
    title: `${course.courseName} course`,
    course
  });
});

exports.getCourseEdit = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const course = await Course.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  const instructor = await User.find({ role: ['instructor', 'owner'] }).exec();

  if (!course) {
    return next(new AppError('There is no course with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('manage-course-edit', {
    title: `${course.courseName} course`,
    course,
    instructor
  });
});

//Music Group
exports.getGroupMusicSummary = managementFactory.getManagerGroupView(
  'manageGroupMusicSummary'
);
//Update Music Group
exports.getGroupMusicDetailsUpdate = managementFactory.getManagerGroupView(
  'manageGroupMusicDetailsUpdate'
);
exports.getGroupMusicEnrollmentInfoUpdate = managementFactory.getManagerGroupView(
  'manageGroupMusicEnrollmentDetailsUpdate'
);
exports.getGroupMusicImagesUpdate = managementFactory.getManagerGroupView(
  'manageGroupMusicImagesUpdate'
);

exports.getGroupMusicInfo = managementFactory.getManagerGroupView(
  'manageGroupMusicInfo'
);

exports.getGroupMusicSettings = managementFactory.getManagerGroupView(
  'manageGroupMusicSettings'
);

exports.getGroupMusicEditSessions = managementFactory.getManagerView(
  'manageGroupMusicGroups'
);

exports.getGroupMusicSessionCreate = managementFactory.getSessionManagerView(
  'manageGroupMusicSessionCreate'
);

exports.getGroupMusicOverviewCreateSessions = managementFactory.getSessionManagerView(
  'manageGroupMusicOverviewCreate'
);

/// Get session overviews
exports.getGroupMusicSessionOverviews = managementFactory.getSessionOverviewManagerView(
  'manageGroupMusicSessionOverview'
);

exports.getGroupMusicSessionOverviewsDetails = managementFactory.getSessionOverviewManagerView(
  'manageGroupMusicSessionOverviewDetails'
);

exports.getGroupMusicSessionOverviewsEnrollment = managementFactory.getSessionOverviewManagerView(
  'manageGroupMusicSessionOverviewEnrollment'
);

exports.getGroupMusicSessionOverviewsSettings = managementFactory.getSessionOverviewManagerView(
  'manageGroupMusicSessionOverviewSettings'
);

//session overview updates

exports.getGroupMusicSessionOverviewsUpdate = managementFactory.getSessionManagerView(
  'manageGroupMusicSessionOverviewUpdate'
);

exports.getGroupMusicSessionOverviewsTimingUpdate = managementFactory.getSessionManagerView(
  'manageGroupMusicSessionOverviewTimingUpdate'
);

exports.getGroupMusicSessionOverviewsEnrollmentUpdate = managementFactory.getSessionManagerView(
  'manageGroupMusicSessionOverviewEnrollmentUpdate'
);

exports.getGroupMusicSessionOverviewsDetailspdate = managementFactory.getSessionManagerView(
  'manageGroupMusicSessionOverviewDetailsUpdate'
);

exports.getGroupMusicSessionOverviewsLocationUpdate = managementFactory.getSessionManagerView(
  'manageGroupMusicSessionOverviewLocationUpdate'
);

/// Music session requests
exports.getGroupMusicSessionInfo = managementFactory.getSessionOverviewSessionManagerView(
  'manageGroupMusicSessionInfo'
);

exports.getGroupMusicSessionSettings = managementFactory.getSessionOverviewSessionManagerView(
  'manageGroupMusicSessionSettings'
);

exports.getGroupMusicSessionUpdate = managementFactory.getSessionOverviewSessionManagerView(
  'manageGroupSessionUpdate'
);

exports.postGroupMusic = (req, res) => {
  res.status(200).render('manageGroupMusicCreate', {
    title: 'Create a music group'
  });
};

exports.postGroupMusicOverview = (req, res) => {
  res.status(200).render('manageGroupMusicCreate', {
    title: 'Create a music group'
  });
};

exports.getCourseOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const courses = await Course.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('course-overview', {
    title: 'All Courses',
    courses
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Register your account'
  });
};

exports.getDashboard = (req, res) => {
  res.status(200).render('dashboard', {
    title: 'Dashboard'
  });
};

exports.getCalendar = catchAsync(async (req, res, next) => {
  const availabilities = await Availability.find({ user: req.user.id });
  res.status(200).render('calendar', {
    title: 'Calendar',
    availabilities
  });
  // return availabilities;
});

exports.getCalendarData = catchAsync(async (req, res, next) => {
  console.log(req.user.id);
  var objectId = req.user.id;
  const availabilities = await Availability.find({ user: objectId });

  console.log(availabilities);
  res.send(availabilities);
});

exports.getSettings = (req, res) => {
  res.status(200).render('settings', {
    title: 'Settings'
  });
};

exports.getMyStudios = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const studioIDs = bookings.map(el => el.studio);
  const studios = await Studio.find({ _id: { $in: studioIDs } });

  res.status(200).render('studio-overview', {
    title: 'My Studios',
    studios
  });
});

exports.getMyCourses = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const courseIDs = bookings.map(el => el.course);
  const courses = await Courses.find({ _id: { $in: courseIDs } });

  res.status(200).render('course-overview', {
    title: 'My Courses',
    courses
  });
});

exports.getMyRegistrations = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const registration = await Registration.find({ user: req.user.id });

  // // 2) Find tours with the returned IDs
  // const courseIDs = bookings.map(el => el.course);
  // const courses = await Courses.find({ _id: { $in: courseIDs } });

  res.status(200).render('bookings', {
    title: 'My registrations',
    registration
  });
});

exports.privateRegistration = (req, res) => {
  res.status(200).render('registration', {
    title: 'Private Lessons'
  });
};

exports.getBilling = (req, res) => {
  res.status(200).render('billing', {
    title: 'Billing'
  });
};

exports.getMyCourse = (req, res) => {
  res.status(200).render('my-courses', {
    title: 'My Courses'
  });
};

exports.getMyPrivateLessons = (req, res) => {
  res.status(200).render('my-private-lessons', {
    title: 'My Private Lessons'
  });
};
exports.getMyLiveClasses = (req, res) => {
  res.status(200).render('my-live-classes', {
    title: 'My Live Classes'
  });
};

exports.getMyInstructorBilling = (req, res) => {
  res.status(200).render('my-instructor-billing', {
    title: 'My Instructor Billing'
  });
};

exports.getMyMessages = (req, res) => {
  res.status(200).render('my-messages', {
    title: 'My Messages'
  });
};

exports.getMyChatroom = (req, res) => {
  res.status(200).render('my-chatroom', {
    title: 'My Messages'
  });
};

// exports.setPublicChatRoom = (req, res) = {
//   const roomId = generateUniqueId(); // Replace generateUniqueId() with your own function to generate a unique ID.
//     res.status(200).render('home', {
//     title: 'My Messages'
//   });
// }

exports.getAllCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.find();
  const instructor = await User.find({ role: ['instructor', 'owner'] });
  res.status(200).render('manage-courses', {
    title: 'Manage Courses',
    courses,
    instructor
  });
});

exports.getAllMusicGroups = catchAsync(async (req, res, next) => {
  const courses = await Course.find();
  const instructor = await User.find({ role: ['instructor', 'owner'] });
  res.status(200).render('manageGroupMusic', {
    title: 'Music Groups',
    courses,
    instructor
  });
});

exports.getAllMessages = (req, res) => {
  Message.find({}),
    (err, messages) => {
      res.status(200).render('manage-messages', {
        title: 'Manage Messages',
        messages
      });
    };
};

exports.getAllEmployees = async (req, res) => {
  const employees = await User.find({
    role: [
      'admin',
      'lead-admin',
      'instructor',
      'instructor-standard',
      'instructor-flex',
      'instructor-principal',
      'owner'
    ]
  });
  res.status(200).render('manageEmployees', {
    title: 'All users',
    employees
  });
};

exports.getAllLiveClasses = (req, res) => {
  res.status(200).render('manage-live-classes', {
    title: 'Manage Live Classes'
  });
};

exports.getReviews = (req, res) => {
  res.status(200).render('reviews', {
    title: 'Reviews'
  });
};

exports.getAllReviews = (req, res) => {
  res.status(200).render('manageReviews', {
    title: 'Your settings'
  });
};

exports.getAllBookings = (req, res) => {
  res.status(200).render('manageBookings', {
    title: 'Your settings'
  });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();

  res.status(200).render('manageUsers', {
    title: 'All users',
    users
  });
};

exports.getAllStudios = (req, res) => {
  res.status(200).render('manageStudios', {
    title: 'Your settings'
  });
};

exports.getAllBilling = (req, res) => {
  res.status(200).render('manageBilling', {
    title: 'Your settings'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});


/// PUBLIC VIEWS
