import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { uploadTour, getUserTours } from "../controllers/tourController.js";
import { storage } from "../utils/cloudinary.js";
import Tour from "../models/Tour.js"; // Add this import

const router = express.Router();
const upload = multer({ storage });

// Change /upload to just / to match frontend request
router.post("/", protect, upload.single("image"), uploadTour);
router.get("/", protect, getUserTours);
router.get("/:id", protect, async (req, res) => {
  try {
    const tour = await Tour.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!tour) {
      return res.status(404).json({ msg: "Tour not found" });
    }
    res.json(tour);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tour", error: err.message });
  }
});

export default router;
