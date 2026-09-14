const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

const checkAuth = require("../middleware/checkAuth");
const checkRole = require("../middleware/checkRole");

// get all posts:
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let posts;
    if (category) {
      posts = await Post.find({ category: category });
    } else {
      posts = await Post.find();
    }
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get post by category:
router.get("/categories", async (req, res) => {
  try {
    const categories = await Post.distinct("category");

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// posts count:
router.get("/count", checkAuth, checkRole(["admin"]), async (req, res) => {
  try {
    const count = await Post.countDocuments();

    res.json({
      count: count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get post count",
    });
  }
});

// get single post by id:
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create a new post:
router.post("/", checkAuth, checkRole(["admin"]), async (req, res) => {
  //new post in object format:
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    author: req.body.author,
    image: req.body.image,
    price: req.body.price,
  });
  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update a existing post:
router.put("/:id", checkAuth, checkRole(["admin"]), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.title = req.body.title || post.title; //update new post if present else old post will be updated
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;
    post.author = req.body.author || post.author;
    post.image = req.body.image || post.image;
    post.price = req.body.price || post.price;
    post.updatedAt = Date.now();
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete post:
router.delete("/:id", checkAuth, checkRole(["admin"]), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // await Post.deleteOne({_id:post._id}); //or
    await Post.findByIdAndDelete(post._id);
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
