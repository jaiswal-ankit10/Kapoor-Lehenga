import cloudinary from "../config/cloudinary.js";

// Upload with a single retry on timeout (http_code 499)
export const uploadToCloudinary = (file, attempt = 1) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error("Invalid file or missing buffer"));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "kapoor-lehenga/products",
        resource_type: "image",
        timeout: 60000, // 60s
      },
      async (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Error:", error);
          if (error.http_code === 499 && attempt < 2) {
            console.warn("Retrying Cloudinary upload (attempt 2)...");
            try {
              const retryUrl = await uploadToCloudinary(file, attempt + 1);
              return resolve(retryUrl);
            } catch (retryErr) {
              return reject(retryErr);
            }
          }
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    stream.end(file.buffer);
  });
};
