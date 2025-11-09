const express = require('express')
const LICENSE_ROUTES = express.Router()

// ----------------------
// CONTROLLERS
// ----------------------
const {
  CREATE_LICENSE,
  UPDATE_LICENSE,
} = require('../../controllers/license.controller/license.controller')

// ----------------------
// MIDDLEWARES
// ----------------------
const { isAuth } = require('../../middlewares/isAuth.middleware')
const { isAdmin } = require('../../middlewares/isAdmin.middleware') // CHECKS IF USER IS ADMIN

// ----------------------
// LICENSE ROUTES
// ----------------------

/**
 * @route   POST /create-license
 * @desc    CREATE A NEW LICENSE
 * @access  PRIVATE (AUTHENTICATED ADMIN USER)
 */
LICENSE_ROUTES.post('/create-license', isAuth, isAdmin, CREATE_LICENSE)

/**
 * @route   POST /update-license/:id
 * @desc    UPDATE AN EXISTING LICENSE BY ID
 * @access  PRIVATE (AUTHENTICATED ADMIN USER)
 */
LICENSE_ROUTES.post('/update-license/:id', isAuth, isAdmin, UPDATE_LICENSE)

module.exports = LICENSE_ROUTES
