const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const createStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary,
    params: async () => {
      return {
        folder: folderName,
        allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
      }
    }
  })
};

const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed (jpg, png, jpeg, webp)'), false);
  }
  cb(null, true);
};

const uploadFolder = (folderName) => {
  const storage = createStorage(folderName);
  return multer({ storage, fileFilter: imageFileFilter });
};

const userAvatar = uploadFolder('vcd_avatar');

module.exports = { userAvatar };
