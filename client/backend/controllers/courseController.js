const multer = require("multer");
// const sharp = require("sharp");
const Course = require("./../models/courseModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

// const storage = gcsSharp(options);

// const multerStoragePDF = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/course/coursePolicyUploads/');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `policy-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (
//     file.mimetype.startsWith("image") ||
//     file.mimetype === "application/pdf"
//   ) {
//     cb(null, true);
//   } else {
//     cb(
//       new AppError(
//         "Not an image or pdf! Please upload only images or pdfs.",
//         400
//       ),
//       false
//     );
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// // const uploadPDF = multer({
// //   storage: multerStoragePDF,
// //   fileFilter: multerFilter
// // });

// exports.uploadCourseImages = upload.fields([
//   { name: "imageCover", maxCount: 1 },
//   { name: "images", maxCount: 3 },
//   { name: "coursePolicyUpload", maxCount: 1 },
// ]);

// exports.uploadPDFHere =
// uploadPDF.single(
// )

// upload.single('image') req.file
// upload.array('images', 5) req.files

// exports.resizeCourseImages = catchAsync(async (req, res, next) => {
//   console.log(req.files.imageCover);
//   if (
//     !req.files.imageCover &&
//     !req.files.images &&
//     !req.files.coursePolicyUpload
//   )
//     return next();
//   console.log(req.body);
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
//   // 3) PolicyUpload
//   if (req.files.coursePolicyUpload) {
//     req.body.coursePolicyUpload = `policy-${Date.now()}.jpeg`;
//     await sharp(req.files.coursePolicyUpload[0].buffer)
//       // .resize(2000, 1333)
//       .toFormat("jpeg")
//       .jpeg({ quality: 90 })
//       .toFile(
//         `public/img/course/coursePolicyUploads/${req.body.coursePolicyUpload}`
//       );
//     // const policyUploadFile = `policy-${req.params.id}-${Date.now()}.pdf`
//     // req.files.coursePolicyUpload[0].originalname = policyUploadFile;
//     // req.body.coursePolicyUpload = policyUploadFile;
//   }
//   next();
// });

exports.aliasTopCourses = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllCourses = factory.getAll(Course);
exports.getCourse = factory.getOne(Course, { path: "reviews" });
// exports.createCourse = factory.createOne(Course);

exports.createCourse = catchAsync(async (req, res, next) => {
  if (req.files.imageCover) req.body.imageCover = req.body.imageCoverName;

  const doc = await Course.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);

exports.getCourseStats = catchAsync(async (req, res, next) => {
  const stats = await Course.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numStudios: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Course.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numCourseStarts: { $sum: 1 },
        courses: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numCourseStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getCoursesWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng.",
        400
      )
    );
  }

  const studios = await Course.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: courses.length,
    data: {
      data: courses,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitutr and longitude in the format lat,lng.",
        400
      )
    );
  }

  const distances = await Course.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      data: distances,
    },
  });
});
