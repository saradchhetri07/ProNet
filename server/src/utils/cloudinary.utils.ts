import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import { BadRequestError } from "../errors/BadRequest.errors";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = async (
  localFilePath: string
): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath || localFilePath.length === 0) return null;
    // Upload to Cloudinary
    const response: UploadApiResponse = await cloudinary.uploader.upload(
      localFilePath,
      {
        resource_type: "auto",
      }
    );

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    throw new BadRequestError("unable to upload to Cloudinary");
  }
};

// export const cloudinaryVideoUpload = async (localFilePath: string): Promise<UploadApiResponse | null> => {
//   try {
//     if (!localFilePath || localFilePath.length === 0) return null;
//     // Upload to Cloudinary
//     const response: UploadApiResponse = await cloudinary.uploader.upload_large(localFilePath, {
//       resource_type: "video",
//     });
//     ("File has been uploaded to Cloudinary:", response.url);
//     fs.unlinkSync(localFilePath);
//     return response;
//   } catch (error) {
//     fs.unlinkSync(localFilePath);
//     throw new ApiError(500, error.message || "Unable to upload to Cloudinary");
//   }
// };

const getPublicId = (publicUrl: string): string => {
  const lastIndex = publicUrl.lastIndexOf("/");

  // If '/' is found, extract the substring after it
  let substring = publicUrl.substring(lastIndex + 1);

  // Find the index of the last occurrence of '.' in the substring
  const extensionIndex = substring.lastIndexOf(".");

  // If '.' is found, remove the extension
  if (extensionIndex !== -1) {
    substring = substring.substring(0, extensionIndex);
  }
  return substring;
};

export const cloudinaryDelete = async (
  publicUrl: string
): Promise<UploadApiResponse> => {
  try {
    const publicId = getPublicId(publicUrl);
    publicId;
    // Delete from Cloudinary
    const response: UploadApiResponse = await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image",
      }
    );

    return response;
  } catch (error) {
    throw new BadRequestError("unable to delete from Cloudinary");
  }
};
