import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  title: String,
  description: String,
  position: {
    top: Number,
    left: Number,
  },
});

const tourSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  imageUrl: { type: String, required: true },
  steps: [stepSchema],
});

export default mongoose.model("Tour", tourSchema);
