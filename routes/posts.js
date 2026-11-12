const express = require('express');
const mongoose = require('mongoose');

const Post = require('../models/Post');

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.post('/', async (req, res) => {
  
  try {
    // Create a new Post instance from req.body.
    const newPost = new Post(req.body);

    // Save it to MongoDB.
    await newPost.save();

    // Return the created post with status code 201.
    return res.status(201).json(newPost);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    // Query all posts from MongoDB.
    const posts = await Post.find();

    // Return the results as JSON.
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  // Validate req.params.id using isValidObjectId().
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id.' });
  }

  try {
    // Find one post by id.
    const post = await Post.findById(req.params.id);
    
    // Return 404 if the post is not found.
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  // Validate req.params.id using isValidObjectId().
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id.' });
  }

  // Update the post with req.body.
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    // Return 404 if the post is not found.
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    // Return the updated post as JSON.
    return res.status(200).json(post);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  // Validate req.params.id using isValidObjectId().
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id.' });
  }
  try {
    // Delete the post by id.
    const post = await Post.findByIdAndDelete(req.params.id);

    // Return 404 if the post is not found.
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    // Return a success message as JSON.
    return res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;