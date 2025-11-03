const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ----------------------
// CREATE CLOUDINARY STORAGE
// ----------------------
// THIS FUNCTION RETURNS A MULTER STORAGE CONFIGURATION FOR CLOUDINARY
// WITH A SPECIFIED FOLDER AND ALLOWED IMAGE FORMATS
const createStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary,
    params: async () => {
      return {
        folder: folderName, // CLOUDINARY FOLDER NAME
        allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp'] // ALLOWED IMAGE FORMATS
      }
    }
  });
};

// ----------------------
// IMAGE FILE FILTER
// ----------------------
// ONLY ALLOW IMAGE FILES TO BE UPLOADED
const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed (jpg, png, jpeg, webp)'), false);
  }
  cb(null, true);
};

// ----------------------
// CREATE UPLOAD MIDDLEWARE
// ----------------------
// GENERATES A MULTER MIDDLEWARE FOR A SPECIFIED FOLDER
const uploadFolder = (folderName) => {
  const storage = createStorage(folderName);
  return multer({ storage, fileFilter: imageFileFilter });
};

// ----------------------
// USER AVATAR UPLOAD
// ----------------------
// MULTER MIDDLEWARE SPECIFICALLY FOR USER AVATAR UPLOAD
const userAvatar = uploadFolder('vcd_avatar');

// ----------------------
// EXPORT
// ----------------------
module.exports = { userAvatar };
