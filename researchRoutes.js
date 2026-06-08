const express = require("express");
const router = express.Router();
const Research = require("../models/Research");

// CREATE RESEARCH
router.post("/", async (req, res) => {
  try {
    const research = new Research(req.body);
    await research.save();

    res.json({
      message: "Research added successfully"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// GET ALL RESEARCH
router.get("/", async (req, res) => {
  try {
    const data = await Research.find();
    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// GET BY CATEGORY
router.get("/:category", async (req, res) => {
  try {

    const data = await Research.find({
      category: req.params.category
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {

    await Research.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.json({
      message: "Updated successfully"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {

    await Research.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;