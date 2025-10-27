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


module.exports = { CREATE_LICENSE }