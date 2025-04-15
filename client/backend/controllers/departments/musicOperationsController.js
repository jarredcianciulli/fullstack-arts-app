const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const multer = require("multer");

// const sharp = require("sharp");
const GroupMusic = require("./../../models/music/groupMusicModel");
const GroupMusicClasses = require("./../../models/music/groupMusicClassesModel");
const PrivateLessonsRequest = require("./../../models/music/privateLessonsRequestModel");
const catchAsync = require("./../../utils/catchAsync");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const factory = require("../handlerFactory");
const {
  addDays,
  getTime,
  getFullDate,
  recurringIntervalDates,
} = require("./../../utils/timeFeature");
const AppError = require("./../../utils/appError");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  S3Client,
  GetObjectCommand,
  PutObjectAclCommand,
} = require("@aws-sdk/client-s3");

const S3 = require("aws-sdk/clients/s3");
const { listenerCount } = require("../../models/availabilityModel");

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }); // Accept single file with field name 'file'

const s3 = new S3({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});

const s3Client = new S3Client({ region }); // Specify your AWS region

// uploads a file to s3
async function uploadFile(file, name) {
  let filePath;
  console.log("hello from upload file function");
  if (file.image) {
    filePath = name + "/" + "image"; // Specify the folder path here
    console.log(filePath);
    const fileStream = fs.createReadStream(file.image[0].path);

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: filePath,
      ContentType: "image/jpeg",
    };

    await s3.upload(uploadParams).promise();
  }
  if (file.policy) {
    filePath = name + "/" + "policy"; // Specify the folder path here
    const fileStream = fs.createReadStream(file.policy[0].path);
    console.log(filePath);

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: filePath,
    };

    await s3.upload(uploadParams).promise();
  }
  if (file.imageCover) {
    filePath = name + "/" + "imageCover"; // Specify the folder path here
    console.log(filePath);

    const fileStream = fs.createReadStream(file.imageCover[0].path);

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: filePath,
      ContentType: "image/jpeg",
    };

    await s3.upload(uploadParams).promise();
  }
}

// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}

exports.uploadRoute = upload.single("policy");
exports.uploadHandler = upload.fields([
  {
    name: "policy",
    maxCount: 1,
  },
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "image",
    maxCount: 1,
  },
]);

// Define file upload route
exports.pdfFileGroupMusicUpload = async (req, res, next) => {
  const file = req.file;
  console.log(req.files);
  console.log(file);

  // apply filter
  // resize
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  const description = req.body.description;
  res.send({ imagePath: `/images/${result.Key}` });
  console.log("...req.body");
  const formBody = { ...req.body };
  //   next();
};

exports.getGroupMusic = factory.getOne(GroupMusic);
exports.getGroupMusicClass = factory.getOne(GroupMusicClasses);
// exports.createGroupMusic = factory.createOne(GroupMusic);
exports.updateGroupMusic = factory.updateOne(GroupMusic);
exports.updateGroupMusicClass = factory.updateOne(GroupMusicClasses);
exports.deleteGroupMusic = factory.deleteOne(GroupMusic);
exports.deleteGroupMusicClass = factory.deleteOne(GroupMusicClasses);

//// getAllSessionsOverviews
exports.getAllGroupMusic = factory.getAll(GroupMusic);
exports.getAllPrivateLessonsRequest = factory.getAll(PrivateLessonsRequest);
exports.getAllGroupMusicClasses = factory.getAllClasses(GroupMusicClasses);

exports.createGroupMusicClass = factory.createOne(GroupMusicClasses);

exports.downloadPDFGroupMusic = catchAsync(async (req, res, next) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: `${req.params.id}-policy.pdf`, // Replace with the S3 object key
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log(url);
    return url;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw error;
  }
});

//// createSessionsOverview
exports.createGroupMusic = catchAsync(async (req, res, next) => {
  //// 1) get policy
  const file = req.file;
  const files = req.files;

  // apply filter
  // resize

  //// 2) create SessionsOverview document in database
  //   const formBody = { ...req.body };
  const formBody = JSON.parse(JSON.stringify(req.body));

  let sessionsOverview;

  await GroupMusic.create(formBody)
    .then((result) => {
      sessionsOverview = result;
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      return error;
    });

  ////    a) add course ID to req.body
  //// 3) if populate sessions is true, populate sessions based on the following
  const populateSessions = req.body.populateSessions;
  if (populateSessions) {
    var startDate = req.body.firstClass;
    var endDate = req.body.lastClass;

    let repeatFrequencyIntervalNumber;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;

    let repeatDays = [req.body.day];
    var dates = [];
    let allStartDates;
    let allEndDates;
    let frequencyCount = "";

    const [startHours, startMinutes] = startTime.split(":");
    const [endHours, endMinutes] = endTime.split(":");

    if (req.body.frequency == "Daily") {
      repeatFrequencyIntervalNumber = 1;
    }
    if (req.body.frequency == "Weekly") {
      repeatFrequencyIntervalNumber = 7;
    }
    if (req.body.frequency == "Bi-weekly") {
      repeatFrequencyIntervalNumber = 14;
    }
    if (req.body.frequency == "Tri-weekly") {
      repeatFrequencyIntervalNumber = 21;
    }
    if (req.body.frequency == "Quad-weekly") {
      repeatFrequencyIntervalNumber = 28;
    }
    if (req.body.frequency == "Monthly") {
      repeatFrequencyIntervalNumber = 30;
    }
    allStartDates = await recurringIntervalDates(
      startDate,
      endDate,
      repeatFrequencyIntervalNumber,
      repeatDays,
      frequencyCount
    );
    allEndDates = await recurringIntervalDates(
      startDate,
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
      const sessions = await GroupMusicClasses.create(item);
    }

    jsonArr.forEach(createSession);

    // this.all_created_availability_start_dates = dates;
  }
  ////      a) frequency
  ////      b) start and end dates and times
  ////      c) reference the SessionsOverview ID in each session
  //// 4) create product or products in Stripe based on price and payment frequency field
  let session;
  await stripe.products
    .create({
      name: sessionsOverview.title,
      description: sessionsOverview.summary,
      default_price_data: {
        currency: "USD",
        //   unit_amount_decimal: 10.0,
        recurring: {
          interval: "month",
          interval_count: 1,
        },
        unit_amount_decimal: sessionsOverview.pricePerSession * 100,
      },
      statement_descriptor: "music course",
      url: `${req.protocol}://${req.get("host")}/manage-music-groups/${
        sessionsOverview.id
      }`,
    })
    .then((result) => {
      session = result;
    })
    .catch((error) => {
      return error;
    });
  //// 5) update Stripe product ID on SessionsOverview that was created.
  const filter = { _id: sessionsOverview.id };

  let update;

  if (files.policy) {
    update = {
      stripeId: session.id,
      policy: `https://d3v3lqv55hqg66.cloudfront.net/${sessionsOverview.id}/policy`,
    };
  }
  if (files.imageCover) {
    update = {
      ...update,
      imageCover: `https://d3v3lqv55hqg66.cloudfront.net/${sessionsOverview.id}/imageCover`,
    };
  }

  if (files.image) {
    update = {
      ...update,
      image: `https://d3v3lqv55hqg66.cloudfront.net/${sessionsOverview.id}/image`,
    };
  }

  let sessionsOverviewUpdateID;
  await GroupMusic.findOneAndUpdate(filter, update, {
    new: true,
  })
    .then((result) => {
      sessionsOverviewUpdateID = result;
    })
    .catch((error) => {
      return error;
      console.error("Error creating user:", error);
    });

  console.log("hihiafingupdate");

  let policyName = sessionsOverview.id + "-policy.pdf";
  ////  6) upload to s3
  let uploadResult;
  console.log(files);
  await uploadFile(files, sessionsOverview.id)
    .then((result) => {
      uploadResult = result;
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });

  //// 7) send created documents in response
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
