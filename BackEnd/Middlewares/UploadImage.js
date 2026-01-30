const multer = require("multer");
const fs = require("fs");
const path = require("path");

const getStorage = (type) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const userId = req.user.id;
      const uploadPath = path.join("uploads", `${userId}`, type);

      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

const upload = (type) => multer({ storage: getStorage(type) });

module.exports = upload;
