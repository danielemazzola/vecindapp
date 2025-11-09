const cloudinary = require('cloudinary').v2
const ENV = require('./config.env')

const CONNECT_CLOUDINARY = () => {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY.name,
    api_secret: ENV.CLOUDINARY.secret,
    api_key: ENV.CLOUDINARY.key,
  })
}
module.exports = CONNECT_CLOUDINARY
