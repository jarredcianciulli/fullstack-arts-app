const catchAsync = require("../../utils/catchAsync");
const factory = require("../handlerFactory");
const Sections = require("../../models/reserve/sectionsModel");
const multer = require("multer");

const {
  S3Client,
  GetObjectCommand,
  PutObjectAclCommand,
} = require("@aws-sdk/client-s3");

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const S3 = require("aws-sdk/clients/s3");

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

exports.getSections = factory.getOne(Sections);
exports.updateSections = factory.updateOne(Sections);
exports.deleteSections = factory.deleteOne(Sections);
exports.getAllSections = factory.getAll(Sections);
exports.createSections = factory.createOne(Sections);
