const mongoose = require("mongoose");
const slugify = require("slugify");

const sectionsSchema = new mongoose.Schema(
  {
    title: String,
    summary: String,
    description: String,
    image: { type: String, default: "sectionImage.svg", required: true },
    active: { type: Boolean, default: false, required: true },
    archived: { type: Boolean, default: false, required: true },
    created_on: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    updated_on: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
sectionsSchema.pre("save", function (next) {
  this.courses_slug = slugify(`session-${this._id}`, { lower: true });
  next();
});

const Sections = mongoose.model("Sections", sectionsSchema);

module.exports = Sections;
