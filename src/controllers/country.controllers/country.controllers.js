const mongoose = require('mongoose')
const COUNTRY_MODEL = require("../../models/country.model");

const CREATE_COUNTRY = async (req, res, next) => {
  try {
    const { code, country } = req.body
    const NewCountry = new COUNTRY_MODEL({
      code, country, creator: req.user._id
    });
    const createCountry = await NewCountry.save();

    if (!createCountry) {
      return res.status(400).json({ message: 'Failed to create country' });
    }
    return res.status(201).json({ message: 'Country created successfully', country: createCountry });

  } catch (error) {
    console.error('Error in CREATE_COUNTRY:', error);
    next(error);
  }
}

const UPDATE_COUNTRY = async (req, res, next) => {
  try {
    const { id } = req.params
    const { user } = req
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' })
    }

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
      { new: true }
    )

    if (!updatedCountry) {
      return res.status(404).json({ message: 'Country not found' })
    }

    return res.status(200).json({
      message: 'Country updated successfully',
      country: updatedCountry,
    })
  } catch (error) {
    console.error('Error in CREATE_COUNTRY:', error);
    next(error);
  }
}

module.exports = { CREATE_COUNTRY, UPDATE_COUNTRY };