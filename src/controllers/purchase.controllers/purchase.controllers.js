const LICENSE_MODEL = require("../../models/license.model")

const PURCHASE = async (req, res, next) => {
  try {
    // PAYMENT
    // END PAYMENT


    const { user } = req
    const { license } = req

    





  } catch (error) {
    console.error('ERROR CONTROLLER PURCHASE')
    next(error)
  }
}

module.exports = {
  PURCHASE
}