const express = require('express')
const MAIN_ROUTES = express.Router()

// ----------------------
// IMPORT ROUTES
// ----------------------
const USER_ROUTES = require('./user.routes/user.routes')
const PURCHASE_ROUTES = require('./user.routes/purchase.routes')
const COUNTRY_ROUTES = require('./country.routes/country.routes')
const LICENSE_ROUTES = require('./license.routes/license.routes')
const COMMUNITY_ROUTES = require('./community.routes/community.routes')

// ----------------------
// MAIN ROUTES
// ----------------------

/**
 * @route   /users
 * @desc    ROUTES RELATED TO USER MANAGEMENT (CREATE, LOGIN, PROFILE, UPDATE)
 */
MAIN_ROUTES.use('/users', USER_ROUTES)

/**
 * @route   /countries
 * @desc    ROUTES RELATED TO COUNTRY MANAGEMENT (CREATE, UPDATE, GET)
 */
MAIN_ROUTES.use('/countries', COUNTRY_ROUTES)

/**
 * @route   /licenses
 * @desc    ROUTES RELATED TO LICENSE MANAGEMENT (CREATE, UPDATE)
 */
MAIN_ROUTES.use('/licenses', LICENSE_ROUTES)

/**
 * @route   /community
 * @desc    ROUTES RELATED TO COMMUNITY MANAGEMENT
 */
MAIN_ROUTES.use('/community', COMMUNITY_ROUTES)

/**
 * @route   /secure/purchase
 * @desc    ROUTES FOR LICENSE PURCHASE AND RELATED OPERATIONS
 */
MAIN_ROUTES.use('/secure/purchase', PURCHASE_ROUTES)

module.exports = MAIN_ROUTES
