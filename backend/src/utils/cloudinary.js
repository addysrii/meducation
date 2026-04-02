import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY 
});

const safeUnlink = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const fullPath = path.resolve(localFilePath);
        console.log("Uploading from:", fullPath);

        const response = await cloudinary.uploader.upload(fullPath, {
            folder: "eLearning",
            resource_type: "auto"
        });

        safeUnlink(fullPath);
        return response;

    } catch (err) {
        safeUnlink(localFilePath);
        console.log("Cloudinary upload error:", err);
        return null;
    }
};

export { uploadOnCloudinary };