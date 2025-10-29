const { VERIFY_TOKEN } = require("../config/jsonwebtoken");
const USER_MODEL = require("../models/user.model");

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization token required.' });
    }
    const isToken = VERIFY_TOKEN(token)
    const user = await USER_MODEL.findById(isToken.id).select('-password')
    if (!user) return res.status(401).json({ message: 'User not exist.' })
    req.user = user;
    next();
  } catch (error) {
    console.error('MIDDLEWARE_isAuth_admin error:', error);
    next(error)
  }
}
module.exports = { isAuth };