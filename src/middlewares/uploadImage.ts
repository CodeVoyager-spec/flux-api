import multer from "multer";
import { AppError } from "../utils/AppError";

// store in memory (best if you're using Cloudinary / S3)
const storage = multer.memoryStorage();

// allow only images
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError("Only image files are allowed", 400));
  }
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
