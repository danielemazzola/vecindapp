const cloudinary = require('cloudinary').v2;

const CONNECT_CLOUDINARY = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_secret: process.env.CLOUDINARY_SECRET,
    api_key: process.env.CLOUDINARY_KEY
  });
};
module.exports = CONNECT_CLOUDINARY;
