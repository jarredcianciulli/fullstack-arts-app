const mongoose = require("mongoose");
const slugify = require("slugify");

// const slugify = require('slugify');
const User = require("./userModel");
const Sessions = require("./sessionsOverviewModel");
const validator = require("validator");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "A course must have a name"],
      unique: true,
      trim: true,
      maxlength: [
        40,
        "A course name must have less or equal then 40 characters",
      ],
      minlength: [
        1,
        "A course name must have more or equal then 10 characters",
      ],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    courseCategory: {
      type: String,
      required: [true, "A course must have a category"],
      enum: ["Music", "Dance", "Theater"],
    },
    courseType: {
      type: String,
      required: [true, "A course must have a course type"],
    },
    courseKind: {
      type: String,
      required: [true, "A session overview must have a type"],
      enum: ["Private", "Group", "Collective"],
    },
    instrument: [
      {
        type: String,
      },
    ],
    slug: String,
    courseCadence: {
      type: String,
      enum: ["Tri-Yearly", "Semi-Yearly", "Quad-Yearly", "Yearly"],
      // required: [true, 'A course must have a frequency']
    },
    courseFrequency: {
      type: String,
      enum: ["Weekly", "Bi-weekly", "Monthly", "Varies"],
      // required: [true, 'A course must have a frequency']
    },
    //   sessions: [
    //     {
    //       type: mongoose.Schema.ObjectId,
    //       ref: 'Sessions'
    //     }
    // ],
    // individual_lesson_maximum_amount: Number,
    // individual_lesson_minimum_amount: Number,
    maxGroupSize: {
      type: Number,
      // required: [true, 'A group must have a group size']
    },
    currentEnrollmentCount: {
      type: Number,
      // required: [true, 'A group must have a group size']
    },
    minGroupSize: {
      type: Number,
      // required: [true, 'A group must have a group size']
    },
    difficulty: {
      type: String,
      enum: {
        values: ["Beginner", "Intermediate", "Advanced"],
        message: "Difficulty is either: easy, medium, difficult",
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
    payFrequency: {
      type: String,
      // required: [true, 'A course must have a pay frequency']
    },
    pricePerSession: {
      type: String,
      // required: [true, 'A course must have a price']
    },
    priceDiscountInformation: {
      discountAmount: {
        type: Number,
        validate: {
          validator: function (val) {
            // this only points to current doc on NEW document creation
            return val < this.price;
          },
          message: "Discount price ({VALUE}) should be below regular price",
        },
      },
      discountPercent: {
        type: Number,
      },
      discountScopeIncludes: {
        type: String,
        enum: [
          "all classes",
          "first class",
          "first three classes",
          "first billing cycle",
        ],
      },
      priceDiscountHeader: String,
      priceDiscountDescription: String,
      expiresAfterDate: Date,
      otherActiveDiscounts: {
        activeDiscountForProducts: Boolean,
        upToPercentage: Number,
        upToAmount: Number,
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A course must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    // curriculumDescription: {
    //   type: String,
    //   trim: true
    // },
    // curriculumInformationUpload: {
    //   type: String,
    // trim: true
    // },
    coursePolicyUpload: {
      type: String,
      // required: [true, 'A course must have a studio policy']
    },
    imageCover: {
      type: String,
      default: "default.jpg",
      // required: [true, 'A course must have a cover image']
    },
    images: [String],
    virtualOptional: {
      type: Boolean,
    },
    virtualOnly: {
      type: Boolean,
    },
    location: {
      type: {
        type: String,
        default: "Point",
        enum: [
          "Point",
          "Virtual",
          "Virtual and on-location",
          "Virtual or on-location",
          "Virtual and/or on-location",
        ],
      },
      coordinates: [Number],
      address: String,
      description: String,
      title: String,
      day: Number,
    },
    performanceInformation: {
      performing: {
        type: Boolean,
      },
      performanceDescription: String,
      performanceOpportunities: Number,
      performanceRehearsals: Number,
    },
    examInformation: {
      exam: Boolean,
      examDescription: String,
      examOpportunities: Number,
    },
    juryInformation: {
      juries: Boolean,
      juryDescription: String,
      juryOpportunities: Number,
    },
    // Exam: Number,
    // ExamDate: [Date],
    //   performanceLocation: [
    //     {
    //       type: {
    //         type: [String],
    //         default: 'Point',
    //         enum: ['Point']
    //       },
    //       coordinates: [Number],
    //       address: String,
    //       description: String,
    //       date: Date
    //     }
    //   ],
    //   locationsActive: Boolean
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
courseSchema.index({ price: 1, ratingsAverage: -1 });
courseSchema.index({ slug: 1 });
courseSchema.index({ startLocation: "2dsphere" });

courseSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Virtual populate
courseSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "studio",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
courseSchema.pre("save", function (next) {
  this.slug = slugify(this.courseName, { lower: true });
  next();
});

// courseSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'instructor',
//     select: 'name'
//   });

//   next();
// });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
