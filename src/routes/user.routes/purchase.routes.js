const express = require('express')

// ----------------------
// CONTROLLERS
// ----------------------
const {
  PURCHASE,
} = require('../../controllers/purchase.controllers/purchase.controllers')

// ----------------------
// MIDDLEWARES
// ----------------------
const { isAuth } = require('../../middlewares/isAuth.middleware')
const isLicense = require('../../middlewares/isLicense.middleware') // CHECKS IF USER HAS A VALID LICENSE

// ----------------------
// PURCHASE LICENSE ROUTES
// ----------------------
const PURCHASE_LICENSE = express.Router()

/**
 * @route   POST /purchase-license/:id
 * @desc    PURCHASE A LICENSE BY ID
 * @access  PRIVATE (AUTHENTICATED USER WITH VALID LICENSE)
 */
PURCHASE_LICENSE.post(
  '/purchase-license/:id',
  isAuth,
  isLicense,
  /**MIDDLEWARE PAYMENT */ PURCHASE,
)

module.exports = PURCHASE_LICENSE
