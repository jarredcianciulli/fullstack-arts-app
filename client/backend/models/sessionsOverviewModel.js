const mongoose = require("mongoose");
const slugify = require("slugify");
const User = require("./userModel");
// const Sessions = require('./sessionsModel');
const validator = require("validator");

const sessionsOverviewSchema = new mongoose.Schema(
  {
    stripeId: String,
    // slug: String,
    group: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
      required: [true, "Session must belong to a Course!"],
    },
    minimum_group_size: Number,
    maximum_group_size: Number,
    ageGroup: {
      type: String,
      // required: [true, 'A course must have an age group']
    },
    minimumAge: Number,
    minimumAgeDate: Date,
    maximumAge: Number,
    maximumAgeDate: Date,
    current_enrollment_count: Number,
    enrollment_startline: Date,
    enrollment_deadline: Date,

    start_hours: {
      type: Number,
      min: 0,
      max: 23,
    },
    start_minutes: {
      type: Number,
      enum: [0, 15, 30, 45],
    },
    end_hours: {
      type: Number,
      min: 0,
      max: 23,
    },
    end_minutes: {
      type: Number,
      enum: [0, 15, 30, 45],
    },
    start_date: Date,
    end_date: Date,
    start_time: Date,
    end_time: Date,
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
      ],
    },
    stay_active_until_enrollment_count: Number,
    virtual: {
      type: Boolean,
    },
    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    sessions_location: {
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
    current_session_cadence_season: {
      type: String,
      enum: [
        "Annual",
        "Fall",
        "Winter",
        "Summer",
        "Spring",
        "Fall/Winter",
        "Winter/Spring",
        "Spring/Summer",
        "Summer/Fall",
        "Fall/Winter/Spring",
        "Winter/Spring/Summer",
        "Spring/Summer/Fall",
        "Summer/Fall/Winter",
        "Fall/Winter/Spring/Summer",
        "Winter/Spring/Summer/Fall",
        "Spring/Summer/Fall/Winter",
        "Summer/Fall/Winter/Spring",
      ],
    },
    current_session_cadence_year: {
      type: String,
    },
    imageCover: {
      type: String,
    },
    images: [String],
    public_view_active: {
      type: Boolean,
      default: false,
    },
    trial_information: {
      offering_trial: {
        type: Boolean,
        default: false,
      },
      offering_drop_ins: {
        type: Boolean,
        default: false,
      },
      offering_tours: {
        type: Boolean,
        default: false,
      },
    },
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

sessionsOverviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "instructor",
    select: "name",
  });
  next();
});

const SessionsOverview = mongoose.model(
  "SessionsOverview",
  sessionsOverviewSchema
);

module.exports = SessionsOverview;
