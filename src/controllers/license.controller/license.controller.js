const mongoose = require('mongoose')
const { generateSkuId } = require('../../helpers/sku-id')
const LICENSE_MODEL = require('../../models/license.model')

/**
 * CREATE_LICENSE
 * Creates a new license and assigns a generated SKU product key.
 */
const CREATE_LICENSE = async (req, res, next) => {
  try {
    const { user } = req

    // GENERATE UNIQUE PRODUCT KEY
    const skuId = generateSkuId()

    // CREATE NEW LICENSE DOCUMENT
    const license = new LICENSE_MODEL({
      ...req.body,
      productKey: skuId,
      creatorAdmin: user._id,
    })

    // VALIDATE CREATION
    if (!license) {
      return res.status(500).json({
        message:
          'The system failed to initialize a new license. Please try again.',
      })
    }

    await license.save()

    return res.status(201).json({
      message: 'License created successfully.',
      license,
    })
  } catch (error) {
    console.error('ERROR IN CREATE_LICENSE CONTROLLER:', error)
    next(error)
  }
}

/**
 * UPDATE_LICENSE
 * Updates an existing license by ID.
 */
const UPDATE_LICENSE = async (req, res, next) => {
  try {
    const { user } = req
    const { id } = req.params

    // VALIDATE ID FORMAT
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid license ID.' })
    }

    // TODO: VALIDATE THAT UPDATE DOES NOT MODIFY RESTRICTED FIELDS (E.G. productKey, creatorAdmin)
    // TODO: ADD INPUT VALIDATION FOR req.body FIELDS (e.g. expirationDate format, status values)

    const updatedLicense = await LICENSE_MODEL.findByIdAndUpdate(
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

    if (!updatedLicense) {
      return res.status(404).json({ message: 'License not found.' })
    }

    return res.status(200).json({
      message: 'License updated successfully.',
      license: updatedLicense,
    })
  } catch (error) {
    console.error('ERROR IN UPDATE_LICENSE CONTROLLER:', error)
    next(error)
  }
}

module.exports = {
  CREATE_LICENSE,
  UPDATE_LICENSE,
}
