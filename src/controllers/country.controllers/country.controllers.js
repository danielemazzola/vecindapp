const mongoose = require('mongoose')
const COUNTRY_MODEL = require('../../models/country.model')

/**
 * CREATE_COUNTRY
 * Creates a new country document.
 */
const CREATE_COUNTRY = async (req, res, next) => {
  try {
    const { code, country } = req.body

    // VALIDATE REQUIRED FIELDS
    if (!code || !country) {
      return res
        .status(400)
        .json({ message: 'Both "code" and "country" fields are required.' })
    }

    // TODO: ADD VALIDATION TO PREVENT DUPLICATE COUNTRY CODES OR NAMES

    // CREATE NEW COUNTRY DOCUMENT
    const newCountry = new COUNTRY_MODEL({
      code,
      country,
      creator: req.user._id,
    })

    const createdCountry = await newCountry.save()

    if (!createdCountry) {
      return res.status(400).json({ message: 'Failed to create country.' })
    }

    return res.status(201).json({
      message: 'Country created successfully.',
      country: createdCountry,
    })
  } catch (error) {
    console.error('ERROR IN CREATE_COUNTRY CONTROLLER:', error)
    next(error)
  }
}

/**
 * UPDATE_COUNTRY
 * Updates an existing country document by ID.
 */
const UPDATE_COUNTRY = async (req, res, next) => {
  try {
    const { id } = req.params
    const { user } = req

    // VALIDATE ID FORMAT
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid country ID.' })
    }

    // TODO: VALIDATE THAT REQUEST BODY CONTAINS ALLOWED FIELDS ONLY (e.g. prevent overwriting "creator")

    const updatedCountry = await COUNTRY_MODEL.findByIdAndUpdate(
      id,
      {
        $set: { ...req.body },
        $push: {
          userUpdate: {
            $each: [{ user: user._id, updatedAt: new Date() }],
            $position: 0,
          },
        },
      },
      { new: true }, // RETURN UPDATED DOCUMENT
    )

    if (!updatedCountry) {
      return res.status(404).json({ message: 'Country not found.' })
    }

    return res.status(200).json({
      message: 'Country updated successfully.',
      country: updatedCountry,
    })
  } catch (error) {
    console.error('ERROR IN UPDATE_COUNTRY CONTROLLER:', error)
    next(error)
  }
}

/**
 * GET_COUNTRIES
 * Retrieves all countries (code and name only).
 */
const GET_COUNTRIES = async (req, res, next) => {
  try {
    const countries = await COUNTRY_MODEL.find().select('code country')

    // TODO: ADD PAGINATION OR FILTERING IF COUNTRY LIST BECOMES LARGE

    return res.status(200).json({
      message: 'Countries retrieved successfully.',
      countries,
    })
  } catch (error) {
    console.error('ERROR IN GET_COUNTRIES CONTROLLER:', error)
    next(error)
  }
}

module.exports = {
  CREATE_COUNTRY,
  UPDATE_COUNTRY,
  GET_COUNTRIES,
}
