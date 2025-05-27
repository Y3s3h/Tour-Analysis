import Tour from "../models/Tour.js";
// import { uploadToCloudinary } from "../utils/cloudinary.js";

// export const uploadTour = async (req, res) => {
//   try {
//     const { steps } = req.body;
//     const file = req.file;

//     if (!file) return res.status(400).json({ msg: "Image is required" });

//     const result = await uploadToCloudinary(file.path);
//     const newTour = await Tour.create({
//       userId: req.user.id,
//       imageUrl: result.secure_url,
//       steps: JSON.parse(steps),
//     });

//     res.status(201).json(newTour);
//   } catch (err) {
//     res.status(500).json({ msg: "Tour upload failed", error: err.message });
//   }
// };

export const uploadTour = async (req, res) => {
  try {
    const { steps } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ msg: "Image is required" });
    }

    const imageUrl = image.path; // Cloudinary returns this

    const parsedSteps = JSON.parse(steps);

    const newTour = new Tour({
      userId: req.user.id,
      imageUrl,
      steps: parsedSteps,
    });

    await newTour.save();
    res.status(201).json({ msg: "Tour uploaded successfully", tour: newTour });
  } catch (err) {
    res.status(500).json({ msg: "Tour upload failed", error: err.message });
  }
};

export const getUserTours = async (req, res) => {
  try {
    const tours = await Tour.find({ userId: req.user.id });
    res.json(tours);
  } catch (err) {
    res.status(500).json({ msg: "Fetch failed", error: err.message });
  }
};
