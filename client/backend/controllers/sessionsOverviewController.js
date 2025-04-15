const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const multer = require("multer");
// const sharp = require("sharp");
const Course = require("./../models/courseModel");
const SessionsOverview = require("./../models/sessionsOverviewModel");
const Sessions = require("./../models/sessionsModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const {
  addDays,
  getTime,
  getFullDate,
  recurringIntervalDates,
} = require("./../utils/timeFeature");
const AppError = require("./../utils/appError");

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (
//     file.mimetype.startsWith("image") ||
//     file.mimetype === "application/pdf"
//   ) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not an image! Please upload only images.", 400), false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// exports.uploadSessionsOverviewImages = upload.fields([
//   { name: "imageCover", maxCount: 1 },
//   { name: "images", maxCount: 3 },
// ]);

// exports.resizeSessionsOverviewImages = catchAsync(async (req, res, next) => {
//   if (!req.files.imageCover && !req.files.images) return next();
//   // 1) Cover image
//   if (req.files.imageCover) {
//     req.body.imageCoverName = `course-${Date.now()}-cover.jpeg`;
//     await sharp(req.files.imageCover[0].buffer)
//       .resize(2000, 2000)
//       .toFormat("jpeg")
//       .jpeg({ quality: 90 })
//       .toFile(`public/img/course/imageCovers/${req.body.imageCoverName}`);

//     // 2) Images
//     if (req.files.images) {
//       req.body.images = [];

//       await Promise.all(
//         req.files.images.map(async (file, i) => {
//           const filename = `course-${Date.now()}-${i + 1}.jpeg`;

//           await sharp(file.buffer)
//             .resize(2000, 2000)
//             .toFormat("jpeg")
//             .jpeg({ quality: 90 })
//             .toFile(`public/img/course/images/${filename}`);

//           req.body.images.push(filename);
//         })
//       );
//     }
//   }
//   next();
// });

exports.getGroupMusicSessionsOverview = factory.getOne(SessionsOverview);
exports.createSessionsOverview = factory.createOne(SessionsOverview);
exports.updateSessionsOverview = factory.updateOne(SessionsOverview);
exports.deleteSessionsOverview = factory.deleteOne(SessionsOverview);

//// getAllSessionsOverviews
exports.getAllSessionsOverviews = factory.getAll(SessionsOverview);

// This should be on views
// //// getAllSessionsOverviewsWithinGroup
// exports.getAllSessionsOverviewsWithinGroup = factory.getAll(SessionsOverview);

//// 1) get all sessionsOverviews that contain the course id

//// getSessionsOverview
// exports.getSessionsOverview = factory.getOne(SessionsOverview);
//// 1) get one sessionsOverview by id

//// createSessionsOverview
exports.createSessionsOverview = catchAsync(async (req, res, next) => {
  //// 1) get group document
  const course = await Course.findOne({ slug: req.body.slug });
  //   console.log(course);

  //// 2) create SessionsOverview document in database
  const formBody = { ...req.body, group: course.id };
  const sessionsOverview = await SessionsOverview.create(formBody);
  ////    a) add course ID to req.body
  //// 3) if populate sessions is true, populate sessions based on the following
  const populateSessions = req.body.populateSessions;
  if (populateSessions) {
    var startTime = req.body.start_date;
    var endDate = req.body.end_date;

    let repeatFrequencyIntervalNumber;
    let startHours = req.body.start_hours;
    let startMinutes = req.body.start_minutes;
    let endHours = req.body.end_hours;
    let endMinutes = req.body.end_minutes;
    let repeatDays = [req.body.day];
    var dates = [];
    let allStartDates;
    let allEndDates;
    let frequencyCount = "";
    if (req.body.interval == "Daily") {
      repeatFrequencyIntervalNumber = 1;
    }
    if (req.body.interval == "Weekly") {
      repeatFrequencyIntervalNumber = 7;
    }
    if (req.body.interval == "Bi-weekly") {
      repeatFrequencyIntervalNumber = 14;
    }
    if (req.body.interval == "Tri-weekly") {
      repeatFrequencyIntervalNumber = 21;
    }
    if (req.body.interval == "Quad-weekly") {
      repeatFrequencyIntervalNumber = 28;
    }
    if (req.body.interval == "Monthly") {
      repeatFrequencyIntervalNumber = 30;
    }
    allStartDates = await recurringIntervalDates(
      startTime,
      endDate,
      repeatFrequencyIntervalNumber,
      repeatDays,
      frequencyCount
    );
    allEndDates = await recurringIntervalDates(
      startTime,
      endDate,
      repeatFrequencyIntervalNumber,
      repeatDays,
      frequencyCount
    );
    let startDates = [];
    let endDates = [];
    let jsonArr = [];
    allStartDates.forEach(function (element) {
      startDates.push(getFullDate(element, startHours, startMinutes));
    });
    allEndDates.forEach(function (element) {
      endDates.push(getFullDate(element, endHours, endMinutes));
    });
    startDates.forEach(createJson);
    function createJson(item, index, arr) {
      //   console.log(item.toLocaleTimeString());
      let date =
        item.getFullYear() + "/" + (item.getMonth() + 1) + "/" + item.getDate();
      jsonArr.push({
        session_type: "Group",
        sessions_overview: sessionsOverview.id,
        date: date,
        start_time: item,
        end_time: endDates[index],
        status: "Scheduled",
        sesssion_location: {
          type: req.body.locationAddress,
          description: req.body.locationDescription,
          title: req.body.locationTitle,
        },
      });
    }

    async function createSession(item) {
      console.log(item);
      const sessions = await Sessions.create(item);
    }
    jsonArr.forEach(createSession);
    // console.log(endDates);

    // this.all_created_availability_start_dates = dates;
  }
  ////      a) frequency
  ////      b) start and end dates and times
  ////      c) reference the SessionsOverview ID in each session
  //// 4) create product or products in Stripe based on price and payment frequency field
  const session = await stripe.products.create({
    name: course.courseName,
    description: course.summary,
    default_price_data: {
      currency: "USD",
      //   unit_amount_decimal: 10.0,
      recurring: {
        interval: "month",
        interval_count: 1,
      },
      unit_amount_decimal: course.pricePerSession * 100,
    },
    statement_descriptor: "music course",
    url: `${req.protocol}://${req.get("host")}/manage-music-groups/${
      sessionsOverview.id
    }`,
  });
  //// 5) update Stripe product ID on SessionsOverview that was created.
  const filter = { _id: sessionsOverview.id };
  const update = { stripeId: session.id };
  const sessionsOverviewUpdateID = await SessionsOverview.findOneAndUpdate(
    filter,
    update,
    {
      new: true,
    }
  );
  //// 6) send created documents in response
  res.status(200).json({
    status: "success",
    data: {
      sessionsOverview,
    },
  });
});

//// updateSessionsOverview
//// 1) check if there are any active subscriptions for this Product in Stripe or in the Registrations database
////   a) if there are any active enrollments either:
////     1) send a notification to the front end to unenrolled all students before altering the SessionsOverview if they will be impacted and escape the function
////     2) warn the user they are altering a SessionsOverview with current enrollments
////     3) warn the user they are making a change that must be manually updated for individual sessions thereafter
////     4) warn the user they are making a change that will affect currently enrolled users.  No further action will be required after this update is made for the change to take effect
//// 2) update product or products in Stripe based on price and payment frequency field updates
//// 3) upon success, update product id or ids in SessionsOverview object if needed
//// 4) update SessionsOverview document in database
//// 5) send a message to the front end that these will need to be updated on individual sessions if they should be impacted by any changes

//// deleteSessionsOverview
//// 1) check if there are any active subscriptions for this Product in Stripe or in the Registrations database
////   a) if there are any active enrollments:
////     1) send a notification to the front end to unenrolled all students before altering the SessionsOverview if they will be impacted and escape the function
//// 2) delete product or products in Stripe based on price and payment frequency field updates
//// 3) upon success, delete all sessions associated with SessionOverview
//// 4) delete SessionsOverview document in database
//// 5) send a message to the front end that all products, sessions, and session overviews have been removed
