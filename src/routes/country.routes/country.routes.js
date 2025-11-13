const express = require('express')
const COUNTRY_ROUTES = express.Router()

// ----------------------
// CONTROLLERS
// ----------------------
const {
  CREATE_COUNTRY,
  UPDATE_COUNTRY,
  GET_COUNTRIES,
} = require('../../controllers/country.controllers/country.controllers')

// ----------------------
// MIDDLEWARES
// ----------------------
const { isAuth } = require('../../middlewares/is-auth.middleware')
const { isAdmin } = require('../../middlewares/is-admin.middleware') // CHECKS IF USER IS ADMIN

// ----------------------
// COUNTRY ROUTES
// ----------------------

/**
 * @route   POST /create-country
 * @desc    CREATE A NEW COUNTRY
 * @access  PRIVATE (AUTHENTICATED ADMIN USER)
 */
COUNTRY_ROUTES.post('/create-country', isAuth, isAdmin, CREATE_COUNTRY)

/**
 * @route   PUT /update-country/:id
 * @desc    UPDATE EXISTING COUNTRY INFORMATION BY ID
 * @access  PRIVATE (AUTHENTICATED ADMIN USER)
 */
COUNTRY_ROUTES.put('/update-country/:id', isAuth, isAdmin, UPDATE_COUNTRY)

/**
 * @route   GET /get-countries
 * @desc    RETRIEVE ALL COUNTRIES
 * @access  PUBLIC
 */
COUNTRY_ROUTES.get('/get-countries', GET_COUNTRIES)

module.exports = COUNTRY_ROUTES
