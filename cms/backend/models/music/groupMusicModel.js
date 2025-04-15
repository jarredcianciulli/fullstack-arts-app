const mongoose = require("mongoose");
const slugify = require("slugify");

const User = require("../userModel");

const groupMusicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A group must have a name"],
      unique: true,
      trim: true,
      maxlength: [
        40,
        "A group name must have less or equal then 40 characters",
      ],
      minlength: [1, "A group name must have more or equal then 10 characters"],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    instrument: [
      {
        type: String,
      },
    ],
    slug: String,
    cadence: {
      type: String,
      enum: ["Tri-Yearly", "Semi-Yearly", "Quad-Yearly", "Yearly", ""],
    },
    frequency: {
      type: String,
      enum: ["Weekly", "Bi-weekly", "Monthly", "Varies", ""],
    },
    season: {
      type: String,
    },
    year: {
      type: Number,
    },
    maxGroupSize: {
      type: Number,
    },
    minGroupSize: {
      type: Number,
    },
    maxAge: { type: Number },
    minAge: { type: Number },
    currentEnrollmentCount: {
      type: Number,
    },
    difficulty: {
      type: String,
      enum: {
        values: ["Beginner", "Intermediate", "Advanced", ""],
        message: "Difficulty is either: Beginner, Intermediate, Advamced",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    pricePerSession: {
      type: String,
      // required: [true, 'A course must have a price']
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A group must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    policy: {
      type: String,
      // required: [true, 'A course must have a studio policy']
    },
    imageCover: {
      type: String,
      default: "default.jpg",
      // required: [true, 'A course must have a cover image']
    },
    firstClass: {
      type: Date,
    },
    lastClass: {
      type: Date,
    },
    startTime: String,
    endTime: String,
    startHours: {
      type: Number,
      min: 0,
      max: 23,
    },
    startMinutes: {
      type: Number,
      enum: [0, 15, 30, 45],
    },
    endHours: {
      type: Number,
      min: 0,
      max: 23,
    },
    endMinutes: {
      type: Number,
      enum: [0, 15, 30, 45],
    },
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "",
      ],
    },
    images: [String],
    image: String,
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point", "Virtual"],
      },
      coordinates: [Number],
      address: String,
      description: String,
      title: String,
      day: Number,
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    dressRehearsals: {
      dressRehearsals: {
        type: Boolean,
      },
      numberOfDressRehearsals: Number,
    },
    performances: {
      performing: {
        type: Boolean,
      },
      numberOfPerformances: Number,
    },
    exams: {
      exam: Boolean,
      numberOfExams: Number,
    },

    jurys: {
      juries: Boolean,
      numberOfJuries: Number,
    },
    competitionInformation: {
      competitions: Boolean,
      numberOfCompetitions: Number,
    },
    stripeId: String,
    archives: Boolean,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 });
groupMusicSchema.index({ price: 1, ratingsAverage: -1 });
groupMusicSchema.index({ slug: 1 });
groupMusicSchema.index({ startLocation: "2dsphere" });

groupMusicSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Virtual populate
groupMusicSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "studio",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
groupMusicSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

groupMusicSchema.pre(/^find/, function (next) {
  this.populate({
    path: "teacher",
    select: "name",
  });
  next();
});

const GroupMusic = mongoose.model("GroupMusic", groupMusicSchema);

module.exports = GroupMusic;
