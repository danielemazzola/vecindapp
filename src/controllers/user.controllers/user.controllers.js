const bcrypt = require('bcrypt')
const USER_MODEL = require('../../models/user.model')
const COUNTRY_MODEL = require('../../models/country.model')
const { CREATE_TOKEN } = require('../../config/jwt.config')
const fetchGeoCode = require('../../config/geocode.config')
const formatForURL = require('../../helpers/format-url')
const { deleteImg } = require('../../helpers/delete-avatar')

/**
 * CREATE_USER
 * Creates a new user with location geocoding and hashed password.
 */
const CREATE_USER = async (req, res, next) => {
  try {
    const {
      name,
      lastname,
      phone,
      email,
      address,
      postal_code,
      city,
      country,
      province,
      taxId,
      password,
    } = req.body

    // VALIDATE REQUIRED FIELDS
    if (
      !name ||
      !lastname ||
      !phone ||
      !email ||
      !address ||
      !postal_code ||
      !city ||
      !country ||
      !province ||
      !password
    ) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    // VERIFY COUNTRY EXISTS
    const countryExists = await COUNTRY_MODEL.findOne({ country })
    if (!countryExists) {
      return res
        .status(400)
        .json({ message: 'Selected country does not exist.' })
    }

    // FETCH GEOLOCATION
    const geoData = await fetchGeoCode(
      formatForURL(province),
      formatForURL(country),
      formatForURL(address),
      formatForURL(city),
      formatForURL(postal_code),
    )

    if (!geoData?.length) {
      return res.status(400).json({
        message:
          'Unable to fetch geolocation data. Please verify the address and try again.',
      })
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 8)

    // CREATE USER
    const newUser = new USER_MODEL({
      name,
      lastname,
      phone,
      email,
      address,
      postal_code,
      city,
      country,
      province,
      taxId,
      password: hashedPassword,
      location: {
        type: 'Point',
        coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)],
      },
    })

    const savedUser = await newUser.save()

    return res.status(201).json({
      message: 'User created successfully.',
      user: savedUser,
    })
  } catch (error) {
    console.error('ERROR IN CREATE_USER:', error)

    // HANDLE DUPLICATE EMAIL ERROR
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(409).json({
        message: 'Email already in use. Please use a different email.',
      })
    }

    // HANDLE VALIDATION ERRORS
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Invalid user data. Please verify the provided information.',
      })
    }

    next(new Error('Error creating user. Please try again later.'))
  }
}

/**
 * LOGIN_USER
 * Authenticates a user and returns a JWT token.
 */
const LOGIN_USER = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // VALIDATIONS
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required.' })
    }

    const user = await USER_MODEL.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    // VERIFY PASSWORD
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    // REMOVE PASSWORD FROM RESPONSE
    const userSafe = user.toObject()
    delete userSafe.password

    // CREATE JWT TOKEN
    const bearerToken = CREATE_TOKEN(user._id)
    userSafe.token = bearerToken

    return res.status(200).json({
      message: 'Login successful.',
      user: userSafe,
    })
  } catch (error) {
    console.error('ERROR IN LOGIN_USER:', error)
    next(new Error('Error logging in. Please try again later.'))
  }
}

/**
 * UPDATE_USER_ADMIN
 * Allows admins to update user information (with optional password and geolocation update).
 */
const UPDATE_USER_ADMIN = async (req, res, next) => {
  try {
    const { id } = req.params
    const {
      name,
      lastname,
      phone,
      email,
      address,
      postal_code,
      city,
      country,
      taxId,
      password,
    } = req.body

    const user = await USER_MODEL.findById(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    // PREPARE UPDATE FIELDS
    const updates = {}
    const updatedFields = []
    const fieldsToCheck = {
      name,
      lastname,
      phone,
      email,
      address,
      postal_code,
      city,
      country,
      taxId,
    }

    for (const [key, value] of Object.entries(fieldsToCheck)) {
      if (value && value !== user[key]) {
        updates[key] = value
        updatedFields.push(key)
      }
    }

    // UPDATE LOCATION IF NEEDED
    if (
      ['address', 'city', 'postal_code', 'country'].some((f) =>
        updatedFields.includes(f),
      )
    ) {
      const geoData = await fetchGeoCode(
        formatForURL(country || user.country),
        formatForURL(address || user.address),
        formatForURL(city || user.city),
        formatForURL(postal_code || user.postal_code),
      )

      if (!geoData?.length) {
        return res.status(400).json({
          message:
            'Unable to fetch geolocation data. Please verify the address and try again.',
        })
      }

      updates.location = {
        type: 'Point',
        coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)],
      }
      updatedFields.push('location')
    }

    // HASH NEW PASSWORD IF PROVIDED
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 8)
      updates.password = hashedPassword
      updatedFields.push('password')
    }

    const updatedUser = await USER_MODEL.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select('-password')

    return res.status(200).json({
      message: 'User updated successfully.',
      updatedFields,
      user: updatedUser,
    })
  } catch (error) {
    console.error('ERROR IN UPDATE_USER_ADMIN:', error)
    next(new Error('Error updating user. Please try again later.'))
  }
}

/**
 * UPDATE_USER
 * Allows a user to update their own profile information.
 */
const UPDATE_USER = async (req, res, next) => {
  try {
    const { _id } = req.user
    const {
      name,
      lastname,
      phone,
      email,
      address,
      postal_code,
      city,
      country,
      taxId,
      password,
    } = req.body

    const user = await USER_MODEL.findById(_id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const updates = {}
    const updatedFields = []
    const fieldsToCheck = {
      name,
      lastname,
      phone,
      email,
      address,
      postal_code,
      city,
      country,
      taxId,
    }

    for (const [key, value] of Object.entries(fieldsToCheck)) {
      if (value && value !== user[key]) {
        updates[key] = value
        updatedFields.push(key)
      }
    }

    // UPDATE GEOLOCATION IF NEEDED
    if (
      ['address', 'city', 'postal_code', 'country'].some((f) =>
        updatedFields.includes(f),
      )
    ) {
      const geoData = await fetchGeoCode(
        formatForURL(country || user.country),
        formatForURL(address || user.address),
        formatForURL(city || user.city),
        formatForURL(postal_code || user.postal_code),
      )

      if (!geoData?.length) {
        return res.status(400).json({
          message:
            'Unable to fetch geolocation data. Please verify the address and try again.',
        })
      }

      updates.location = {
        type: 'Point',
        coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)],
      }
      updatedFields.push('location')
    }

    // HASH NEW PASSWORD IF PROVIDED
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 8)
      updates.password = hashedPassword
      updatedFields.push('password')
    }

    const updatedUser = await USER_MODEL.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select('-password')

    return res.status(200).json({
      message: 'User updated successfully.',
      updatedFields,
      user: updatedUser,
    })
  } catch (error) {
    console.error('ERROR IN UPDATE_USER:', error)
    next(new Error('Error updating user. Please try again later.'))
  }
}

/**
 * PROFILE_USER
 * Returns the current logged-in user's data.
 */
const PROFILE_USER = async (req, res, next) => {
  try {
    const { user } = req
    return res.status(200).json({ user })
  } catch (error) {
    console.error('ERROR IN PROFILE_USER:', error)
    next(new Error('Error retrieving user profile. Please try again later.'))
  }
}

/**
 * UPDATE_AVATAR
 * Updates the user's avatar image.
 */
const UPDATE_AVATAR = async (req, res, next) => {
  try {
    const { user } = req

    if (req.file) {
      deleteImg(user.avatar)
      req.body.image = req.file.path
    }

    const avatar = await USER_MODEL.findByIdAndUpdate(
      user._id,
      { $set: { avatar: req.body.image } },
      { new: true },
    ).select('-password')

    return res
      .status(200)
      .json({ message: 'Avatar updated successfully.', avatar })
  } catch (error) {
    console.error('ERROR IN UPDATE_AVATAR:', error)
    next(error)
  }
}

module.exports = {
  CREATE_USER,
  LOGIN_USER,
  UPDATE_USER_ADMIN,
  UPDATE_USER,
  PROFILE_USER,
  UPDATE_AVATAR,
}
