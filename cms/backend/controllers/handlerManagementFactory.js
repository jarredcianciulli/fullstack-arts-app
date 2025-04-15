const Course = require('../models/courseModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Registration = require('../models/registrationModel');
const Availability = require('../models/availabilityModel');
const SessionsOverview = require('../models/sessionsOverviewModel');
const Sessions = require('../models/sessionsModel');
const catchAsync = require('../utils/catchAsync');

exports.getManagerGroupView = View =>
  catchAsync(async (req, res, next) => {
    // 1) Get the data, for the requested tour (including reviews and guides)
    const course = await Course.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      fields: 'review rating user'
    });
    const instructor = await User.find({
      role: ['instructor', 'owner']
    }).exec();

    if (!course) {
      return next(new AppError('There is no course with that name.', 404));
    }

    // 2) Build template
    // 3) Render template using data from 1)
    res.status(200).render(View, {
      title: `${course.courseName}`,
      course,
      instructor
    });
  });

exports.getManagerView = View =>
  catchAsync(async (req, res, next) => {
    const course = await Course.findOne({ slug: req.params.slug });
    const sessions = await SessionsOverview.find({ group: course.id });
    const instructor = await User.find({
      role: ['instructor', 'owner']
    }).exec();

    if (!course) {
      return next(new AppError('There is no course with that name.', 404));
    }

    // 2) Build template
    // 3) Render template using data from 1)

    if (!sessions) {
      res.status(200).render(View, {
        title: `${course.courseName}`,
        course,
        instructor
      });
    } else {
      res.status(200).render(View, {
        title: `${course.courseName}`,
        course,
        instructor,
        sessions
      });
    }
  });

exports.getSessionManagerView = View =>
  catchAsync(async (req, res, next) => {
    // 1) Get the data, for the requested tour (including reviews and guides)
    const course = await Course.findOne({ slug: req.params.slug });
    const sessionOverviews = await SessionsOverview.findOne({
      _id: req.params.id
    });
    const instructor = await User.find({
      role: ['instructor', 'owner']
    }).exec();

    if (!course) {
      return next(new AppError('There is no course with that name.', 404));
    }

    // 2) Build template
    // 3) Render template using data from 1)

    if (!sessionOverviews) {
      res.status(200).render(View, {
        title: `${course.courseName}`,
        course,
        instructor
      });
    } else {
      res.status(200).render(View, {
        title: `${course.courseName}`,
        course,
        instructor,
        sessionOverviews
      });
    }
  });

exports.getSessionOverviewManagerView = View =>
  catchAsync(async (req, res, next) => {
    // 1) Get the data, for the requested tour (including reviews and guides)
    const course = await Course.findOne({ slug: req.params.slug });
    const sessionOverviews = await SessionsOverview.findOne({
      _id: req.params.id
    });
    const sessions = await Sessions.find({
      sessions_overview: req.params.id
    })
      .sort({ date: 'ascending' })
      .exec();
    const instructor = await User.find({
      role: ['instructor', 'owner']
    }).exec();

    if (!course) {
      return next(new AppError('There is no course with that name.', 404));
    }

    // 2) Build template
    // 3) Render template using data from 1)

    if (!sessionOverviews) {
      res.status(200).render(View, {
        title: `${course.courseName}`,
        course,
        instructor
      });
    } else {
      res.status(200).render(View, {
        title: `${course.courseName}`,
        course,
        instructor,
        sessionOverviews,
        sessions
      });
    }
  });

exports.getSessionOverviewSessionManagerView = View =>
  catchAsync(async (req, res, next) => {
    // 1) Get the data, for the requested tour (including reviews and guides)
    const course = await Course.findOne({ slug: req.params.slug });
    const session = await Sessions.findOne({
      _id: req.params.id
    });

    const sessionOverviews = await SessionsOverview.findOne({
      _id: session.sessions_overview
    });

    const instructor = await User.find({
      role: ['instructor', 'owner']
    }).exec();

    if (!course) {
      return next(new AppError('There is no course with that name.', 404));
    }

    // 2) Build template
    // 3) Render template using data from 1)

    if (!sessionOverviews) {
      res.status(200).render(View, {
        title: `${course.courseName}`,
        course,
        instructor
      });
    } else {
      res.status(200).render(View, {
        title: `${course.courseName}`,
        course,
        instructor,
        sessionOverviews,
        session
      });
    }
  });
