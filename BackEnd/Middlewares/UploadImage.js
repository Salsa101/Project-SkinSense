const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

// pakai memory storage agar file tidak tersimpan di server
const storage = multer.memoryStorage();
const upload = multer({ storage });

// fungsi upload ke Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );

    const readable = new Readable();
    readable._read = () => {};
    readable.push(fileBuffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

module.exports = { upload, uploadToCloudinary };
