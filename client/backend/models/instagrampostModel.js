// models/Post.js
const mongoose = require("mongoose");

const InstagramPostSchema = new mongoose.Schema({
  instagramId: { type: String, unique: true, required: true },
  user: { type: String, required: true },
  imageUrl: { type: String, required: true },
  caption: { type: String },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, required: true },
});

module.exports = mongoose.model("InstaGramPost", InstagramPostSchema);
