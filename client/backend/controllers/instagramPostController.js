// controllers/postController.js
const InstagramPost = require("../models/InstagramPost");
const axios = require("axios");

const INSTAGRAM_API_URL = "https://graph.instagram.com/me/media";
const ACCESS_TOKEN = "your_instagram_access_token";

// Fetch and store Instagram posts
exports.fetchAndStoreInstagramPosts = async (req, res) => {
  try {
    const response = await axios.get(
      `${INSTAGRAM_API_URL}?fields=id,caption,media_url,timestamp,like_count&access_token=${ACCESS_TOKEN}`
    );
    const posts = response.data.data;

    for (const post of posts) {
      const existingPost = await InstagramPost.findOne({
        instagramId: post.id,
      });
      if (!existingPost) {
        await new InstagramPost({
          instagramId: post.id,
          user: "instagram_user",
          imageUrl: post.media_url,
          caption: post.caption,
          likes: post.like_count || 0,
          createdAt: new Date(post.timestamp),
        }).save();
      } else {
        existingPost.likes = post.like_count || existingPost.likes;
        await existingPost.save();
      }
    }
    res.status(200).json({ message: "Instagram posts synced successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get saved Instagram posts
exports.getSavedPosts = async (req, res) => {
  try {
    const posts = await InstagramPost.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
