import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";

/**
 * Cloudinary config
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET!,
});

/**
 * Upload image using buffer (multer memory storage)
 */
export const uploadImageToCloudinary = (
  buffer: Buffer,
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result as UploadApiResponse);
      })
      .end(buffer);
  });
};

/**
 * Delete image from Cloudinary using publicId
 */
export const deleteImageFromCloudinary = async (
  publicId?: string,
): Promise<void> => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId);
};
