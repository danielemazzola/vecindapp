const mongoose = require('mongoose')
const ENV = require('./env.config')

const CONNECT_DDBB = async (req, res, next) => {
  try {
    await mongoose.connect(ENV.MONGODB_URI)
    console.log(`Connect: MongoDB`)
  } catch (error) {
    console.error('CONNECT_DDBB', error)
    next(error)
  }
}

module.exports = CONNECT_DDBB
