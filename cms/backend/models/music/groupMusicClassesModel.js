const mongoose = require("mongoose");
const slugify = require("slugify");
const GroupMusic = require("./groupMusicModel");

const groupMusicClassesSchema = new mongoose.Schema(
  {
    sessions_overview: {
      type: mongoose.Schema.ObjectId,
      ref: "GroupMusic",
    },
    title: String,
    description: String,
    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    substitute_instructor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    date: Date,
    start_full_date: Date,
    end_full_date: Date,
    start_date: Date,
    end_date: Date,
    start_time: Date,
    start_hours: Date,
    start_minutes: Date,
    end_time: Date,
    end_hours: Date,
    end_minutes: Date,
    public_view_active: Boolean,
    status: {
      type: String,
      enum: [
        "Cancelled",
        "Holiday",
        "Observed holiday",
        "Rescheduled",
        "Rescheduling in progress",
        "TBA",
        "Scheduled",
      ],
      default: "Scheduled",
    },
    rescheduled: {
      active: Boolean,
      date: Date,
      start_hours: Date,
      start_minutes: Date,
      start_time: Date,
      end_hours: Date,
      end_minutes: Date,
      end_time: Date,
      updated_on: [Date],
      user: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
      ],
    },
    session_location: {
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
    },
    session_location_update: {
      active: Boolean,
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
    },
    updated_on: {
      type: [Date],
      default: Date.now(),
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

groupMusicClassesSchema.pre(/^find/, function (next) {
  this.populate({
    path: "instructor",
    select: "name",
  });
  next();
});

// groupMusicClassesSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "GroupMusic",
//     select: "title",
//     options: { _recursed: true },
//   });
//   next();
// });

groupMusicClassesSchema.pre(/^find/, function (next) {
  this.populate({
    path: "substitute_instructor",
    select: "name",
  });
  next();
});

groupMusicClassesSchema.pre(/^find/, function (next) {
  this.populate({
    path: "sessions_overview",
    select: "title",
  });
  next();
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
groupMusicClassesSchema.pre("save", function (next) {
  this.courses_slug = slugify(`session-${this._id}`, { lower: true });
  next();
});
const GroupMusicClasses = mongoose.model(
  "GroupMusicClasses",
  groupMusicClassesSchema
);

module.exports = GroupMusicClasses;
