import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { protect } from "../middleware/authMiddleware.js";
import Recording from "../models/Recording.js";

const router = express.Router();

// Ensure local recordings directory exists
const recordingsDir = path.join("public", "uploads", "recordings");
fs.mkdirSync(recordingsDir, { recursive: true });

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, recordingsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Upload a new recording
router.post("/upload", protect, upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No video file uploaded" });
    }

    const publicUrl = `/uploads/recordings/${req.file.filename}`;

    const recording = await Recording.create({
      userId: req.user.id,
      url: publicUrl,
      public_id: req.file.filename,
    });

    res.status(201).json({
      msg: "Recording uploaded successfully",
      recording,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      msg: "Upload failed",
      error: err.message,
    });
  }
});

// Get all recordings for a user
router.get("/", protect, async (req, res) => {
  try {
    const recordings = await Recording.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    // Transform the recordings to include full URLs
    const recordingsWithUrls = recordings.map((rec) => ({
      ...rec.toObject(),
      url: rec.url, // Make sure this is the complete URL from storage
    }));

    res.json({ recordings: recordingsWithUrls });
  } catch (err) {
    res.status(500).json({ msg: "Fetch failed", error: err.message });
  }
});

// Delete a
// ...existing code...

// Delete a recording
router.delete("/:id", protect, async (req, res) => {
  try {
    const recording = await Recording.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!recording) {
      return res.status(404).json({ msg: "Recording not found" });
    }

    try {
      // Delete from local storage
      const filePath = path.resolve(
        process.cwd(),
        "public",
        "uploads",
        "recordings",
        recording.public_id
      );

      console.log("Attempting to delete file:", filePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("File deleted successfully");
      } else {
        console.log("File not found in filesystem");
      }

      // Delete from database
      await Recording.findByIdAndDelete(recording._id);

      res.json({
        msg: "Recording deleted successfully",
        deletedRecording: recording,
      });
    } catch (fileErr) {
      console.error("File deletion error:", fileErr);
      // Still delete from database even if file deletion fails
      await Recording.findByIdAndDelete(recording._id);
      res.json({
        msg: "Recording deleted from database but file deletion failed",
        error: fileErr.message,
        deletedRecording: recording,
      });
    }
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({
      msg: "Delete failed",
      error: err.message,
    });
  }
});

export default router;
