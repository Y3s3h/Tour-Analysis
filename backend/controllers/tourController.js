import Tour from "../models/Tour.js";

export const uploadTour = async (req, res) => {
  try {
    // Validate request
    if (!req.file) {
      return res.status(400).json({ msg: "Please upload an image" });
    }

    if (!req.body.steps) {
      return res.status(400).json({ msg: "Please add tour steps" });
    }

    // Create tour with validated data
    const tour = await Tour.create({
      userId: req.user.id,
      imageUrl: req.file.path,
      steps: JSON.parse(req.body.steps),
    });

    res.status(201).json({
      success: true,
      tour,
    });
  } catch (err) {
    console.error("Tour upload error:", err);
    res.status(500).json({
      msg: "Failed to create tour",
      error: err.message,
    });
  }
};

export const getUserTours = async (req, res) => {
  try {
    const tours = await Tour.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: tours.length,
      tours,
    });
  } catch (err) {
    console.error("Get tours error:", err);
    res.status(500).json({
      msg: "Failed to fetch tours",
      error: err.message,
    });
  }
};

export const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!tour) {
      return res.status(404).json({ msg: "Tour not found" });
    }

    res.json({
      success: true,
      tour,
    });
  } catch (err) {
    console.error("Get tour error:", err);
    res.status(500).json({
      msg: "Failed to fetch tour",
      error: err.message,
    });
  }
};
