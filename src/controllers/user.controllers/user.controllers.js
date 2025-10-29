const bcrypt = require('bcrypt');
const USER_MODEL = require("../../models/user.model");
const COUNTRY_MODEL = require('../../models/country.model');
const { CREATE_TOKEN } = require('../../config/jsonwebtoken');
const fetchGeoCode = require("../../config/fetchGeoCode");
const formatForURL = require("../../helpers/formatForURL");
const { deleteImg } = require('../../helpers/delete.avatar');

const CREATE_USER = async (req, res, next) => {
  try {
    const { name, lastname, phone, email, address, postal_code, city, country, province, taxId, password } = req.body;
    // VALIDATIONS
    if (!name || !lastname || !phone || !email || !address || !postal_code || !city || !country || !province || !password) {
      const error = new Error('All fields are required.');
      error.status = 400;
      return next(error);
    }

    const COUNTRY_REGISTER = await COUNTRY_MODEL.findOne({ country })
    console.log(COUNTRY_REGISTER);

    if (!COUNTRY_REGISTER) {
      const error = new Error('Country is not exist.');
      error.status = 400;
      return next(error);
    }

    // LOCATION FETCH
    const newCountry = formatForURL(country)
    const newCity = formatForURL(city);
    const newAddress = formatForURL(address);
    const newPC = formatForURL(postal_code);
    const newProvince = formatForURL(province);
    const geocodeData = await fetchGeoCode(newProvince, newCountry, newAddress, newCity, newPC);
    if (!geocodeData) {
      return res.status(400).json({ message: 'Unable to fetch geolocation data. Please check the address information and try again.' });
    }

    // CREATE USER
    const NEW_USER = new USER_MODEL({
      name, lastname, phone, email, address, postal_code, city, country, province, taxId, password,
      location: {
        type: 'Point',
        coordinates: [parseFloat(geocodeData[0].lon), parseFloat(geocodeData[0].lat)]
      }
    });

    const SAVED_USER = await NEW_USER.save();
    return res.status(201).json({
      message: 'User created successfully.',
      user: SAVED_USER
    });

  } catch (error) {
    console.error('Error in CREATE_USER:', error);

    let err = new Error('Error creating user. Please try again later.');
    err.status = 500;

    // Duplicate key (e.g., email already exists)
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      err = new Error('Email already in use. Please use a different email.');
      err.status = 409;
    }

    // Validation error (e.g., missing required fields from Mongoose)
    if (error.name === 'ValidationError') {
      err = new Error('Invalid user data. Please verify the provided information.');
      err.status = 400;
    }

    return next(err);
  }
}

const LOGIN_USER = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // VALIDATIONS
    if (!email || !password) {
      const error = new Error('Email and password are required.');
      error.status = 400;
      return next(error);
    }
    const USER = await USER_MODEL.findOne({ email: email });
    if (!USER) {
      const error = new Error('Invalid email or password.');
      error.status = 401;
      return next(error);
    }
    // COMPARE PASSWORDS (with bcrypt)
    const isMatch = await bcrypt.compare(password, USER.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.status = 401;
      return next(error);
    }

    // REMOVE PASSWORD FROM RESPONSE
    const userSafe = USER.toObject();
    delete userSafe.password;

    // CREATE JWT
    const bearer_token = CREATE_TOKEN(USER._id);
    userSafe.token = bearer_token;

    return res.status(200).json({
      message: 'Login successful.',
      user: userSafe
    });

  } catch (error) {
    console.error('Error in LOGIN_USER:', error);
    const err = new Error('Error logging in. Please try again later.');
    return next(err);
  }
}

const UPDATE_USER_ADMIN = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, lastname, phone, email, address, postal_code, city, country, taxId, password } = req.body;

    const user = await USER_MODEL.findById(id);
    if (!user) {
      const error = new Error('User not found.');
      error.status = 404;
      return next(error);
    }

    // Prepare updates object
    const updates = {};
    const updatedFields = [];

    const fieldsToCheck = { name, lastname, phone, email, address, postal_code, city, country, taxId };

    // Check which fields changed
    for (const [key, value] of Object.entries(fieldsToCheck)) {
      if (value && value !== user[key]) {
        updates[key] = value;
        updatedFields.push(key);
      }
    }

    // If address or location-related fields changed, update geolocation
    if (['address', 'city', 'postal_code', 'country'].some(f => updatedFields.includes(f))) {
      const newCountry = formatForURL(country || user.country);
      const newCity = formatForURL(city || user.city);
      const newAddress = formatForURL(address || user.address);
      const newPC = formatForURL(postal_code || user.postal_code);

      const geocodeData = await fetchGeoCode(newCountry, newAddress, newCity, newPC);
      if (!geocodeData) {
        return res.status(400).json({
          message: 'Unable to fetch geolocation data. Please check the address information and try again.'
        });
      }

      updates.location = {
        type: 'Point',
        coordinates: [parseFloat(geocodeData[0].lon), parseFloat(geocodeData[0].lat)]
      };
      updatedFields.push('location');
    }

    // If there is a password update, hash it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 8);
      updates.password = hashedPassword;
      updatedFields.push('password');
    }

    const updatedUser = await USER_MODEL.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password')

    if (!updatedUser) {
      const error = new Error('User not found.');
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      message: 'User updated successfully.',
      updatedFields,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error in UPDATE_USER:', error);
    const err = new Error('Error updating user. Please try again later.');
    err.status = 500;
    return next(err);
  }
};

const UPDATE_USER = async (req, res, next) => {
  try {
    const {_id} = req.user
    const { name, lastname, phone, email, address, postal_code, city, country, taxId, password } = req.body;

    const user = await USER_MODEL.findById(_id);
    if (!user) {
      const error = new Error('User not found.');
      error.status = 404;
      return next(error);
    }

    // Prepare updates object
    const updates = {};
    const updatedFields = [];

    const fieldsToCheck = { name, lastname, phone, email, address, postal_code, city, country, taxId };

    // Check which fields changed
    for (const [key, value] of Object.entries(fieldsToCheck)) {
      if (value && value !== user[key]) {
        updates[key] = value;
        updatedFields.push(key);
      }
    }

    // If address or location-related fields changed, update geolocation
    if (['address', 'city', 'postal_code', 'country'].some(f => updatedFields.includes(f))) {
      const newCountry = formatForURL(country || user.country);
      const newCity = formatForURL(city || user.city);
      const newAddress = formatForURL(address || user.address);
      const newPC = formatForURL(postal_code || user.postal_code);

      const geocodeData = await fetchGeoCode(newCountry, newAddress, newCity, newPC);
      if (!geocodeData) {
        return res.status(400).json({
          message: 'Unable to fetch geolocation data. Please check the address information and try again.'
        });
      }

      updates.location = {
        type: 'Point',
        coordinates: [parseFloat(geocodeData[0].lon), parseFloat(geocodeData[0].lat)]
      };
      updatedFields.push('location');
    }

    // If there is a password update, hash it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 8);
      updates.password = hashedPassword;
      updatedFields.push('password');
    }

    const updatedUser = await USER_MODEL.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password')

    if (!updatedUser) {
      const error = new Error('User not found.');
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      message: 'User updated successfully.',
      updatedFields,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error in UPDATE_USER:', error);
    const err = new Error('Error updating user. Please try again later.');
    err.status = 500;
    return next(err);
  }
};

const PROFILE_USER = async (req, res, next) => {
  try {
    const { user } = req
    return res.status(200).json({ user: user });
  } catch (error) {
    console.error('Error in PROFILE_USER:', error);
    const err = new Error('Error retrieving users. Please try again later.');
    err.status = 500;
    return next(err);
  }
};

const UPDATE_AVATAR = async (req, res, next) => {
  const { user } = req
  try {
    if (req.file) {
      deleteImg(user.avatar)
      req.body.image = req.file.path
    }
    const avatar = await USER_MODEL.findByIdAndUpdate(
      user._id,
      { $set: { avatar: req.body.image } },
      { new: true }
    ).select('-password')

    return res.status(200).json({ message: 'Update avatar', avatar })
  } catch (error) {
    console.error('UPDATE_AVATAR Controller', error)
    next(error)
  }
}


module.exports = {
  CREATE_USER,
  LOGIN_USER,
  UPDATE_USER_ADMIN,
  UPDATE_USER,
  PROFILE_USER,
  UPDATE_AVATAR
}