import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure folder exists
const uploadPath = path.join("public", "uploads", "recordings");
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `recording-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

export default upload;
