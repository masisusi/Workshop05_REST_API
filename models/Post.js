const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    // Define the post fields for this schema.
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    // Keep timestamps enabled (or decide based on requirements).
    timestamps: true
  }
);

module.exports = mongoose.model('Post', postSchema);