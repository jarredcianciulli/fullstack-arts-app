const mongoose = require('mongoose');

// const slugify = require('slugify');
const User = require('./userModel');
const validator = require('validator');

const sessionsBookingsSchema = new mongoose.Schema(
  {
    sessions_category: {
      type: String,
      required: [true, 'A course must have a course type']
    },
    group: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: [true, 'Courses must belong to a Course!']
    },
    current_session_enrollment_count: Number,
    session_timing_structure: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: [true, 'Courses must belong to a Course!']
    },
    current_session_cadence: String,
    sessions: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Sessions',
        required: [true, 'sessions bookings must belong to a session!']
      },
      {
        active_charge: Boolean,
        payment_status: String,
        discount_percent: Number,
        discount_amount: Number,
        credited: Boolean,
        status_information: [
          {
            status: String,
            status_update_user: {
              type: mongoose.Schema.ObjectId,
              ref: 'User',
              required: [true, 'session booking update must belong to a user!']
            },
            status_update_user_requester: {
              type: mongoose.Schema.ObjectId,
              ref: 'User',
              required: [
                true,
                'session booking update must be requested by a user!'
              ]
            },
            update_reason: String,
            make_up_update: Boolean,
            credit_update: Boolean,
            status_update_date: Date
          }
        ]
      }
    ],
    imageCover: {
      type: String,
      required: [true, 'A course must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    active: Boolean
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'course',
    select: 'courseName'
  });
  next();
});

// tourSchema.index({ price: 1 });
courseSchema.index({ price: 1, ratingsAverage: -1 });
courseSchema.index({ courses_slug: 1 });
courseSchema.index({ startLocation: '2dsphere' });

courseSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Virtual populate
courseSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'studio',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
courseSchema.pre('save', function(next) {
  this.courses_slug = slugify(
    `sessions-overview-${this.sessions_booking_overview_id}`,
    {
      lower: true
    }
  );
  next();
});

courseSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'instructor',
    select: '-__v -passwordChangedAt'
  });

  next();
});

const SessionsBookings = mongoose.model(
  'SessionsBookings',
  sessionsBookingsSchema
);

module.exports = SessionsBookings;
