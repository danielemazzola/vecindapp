const mongoose = require("mongoose")
const { generateSkuId } = require("../../helpers/SkuId")
const LICENSE_MODEL = require("../../models/license.model")

const CREATE_LICENSE = async (req, res, next) => {
  try {
    const { user } = req
    const SkuId = generateSkuId()
    const license = new LICENSE_MODEL({
      ...req.body,
      productKey: SkuId,
      creatorAdmin: user._id
    })
    if (!license) {
      const error = new Error('The system did not create a license. Please try again.');
      error.status = 500;
      return next(error);
    }

    await license.save()

    return res.status(201).json({ message: 'The license has been created successfully.', license })

  } catch (error) {
    console.error('CREATE_LICENSE Controller', error)
    next(error)
  }
}

const UPDATE_LICENSE = async (req, res, next) => {
  try {
    const { user } = req
    const { id } = req.params
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' })
    }
    const updateLicense = await LICENSE_MODEL.findByIdAndUpdate(id, {
      $set: {
        ...req.body
      },
      $push: {
        userUpdate: {
          $each: [{ user: user._id, updatedAt: new Date() }],
          $position: 0,
        },
      }
    }, { new: true })

    if (!updateLicense) return res.status(404).json({ message: 'License not found' })
    return res.status(200).json({ message: 'License updated successfully', license: updateLicense })

  } catch (error) {
    console.error('ERROR UPDATE_LICENSE', error)
    next(error)
  }
}

module.exports = { CREATE_LICENSE, UPDATE_LICENSE }