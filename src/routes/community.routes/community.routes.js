const express = require('express');
const COMMUNITY_ROUTES = express.Router();

// ----------------------
// CONTROLLERS
// ----------------------
const {
  CREATE_COMMUNITY,
  REQUEST_USER_IN_COMMUNITY,
  REQUEST_USER_IN_COMMUNITY_PENDING,
  CONFIRM_REQUEST_USER_IN_COMMUNITY,
  GET_COMMUNITY
} = require('../../controllers/community.controllers/community.controllers');

// ----------------------
// MIDDLEWARES
// ----------------------
const { isAuth } = require('../../middlewares/isAuth.middleware');
const authority = require('../../middlewares/authority.middleware'); // CHECKS IF USER IS ADMIN OR HAS A VALID LICENSE

// ----------------------
// COMMUNITY ROUTES
// ----------------------

/**
 * @route   POST /create-community
 * @desc    CREATE A NEW COMMUNITY
 * @access  PRIVATE (AUTHENTICATED USER WITH PERMISSIONS)
 */
COMMUNITY_ROUTES.post(
  '/create-community',
  isAuth,
  authority,
  CREATE_COMMUNITY
);

/**
 * @route   POST /request-community/:id
 * @desc    SEND A JOIN REQUEST TO A COMMUNITY
 * @access  PRIVATE (AUTHENTICATED USER)
 */
COMMUNITY_ROUTES.post(
  '/request-community/:id',
  isAuth,
  REQUEST_USER_IN_COMMUNITY
);

/**
 * @route   GET /request-pending-community/:id
 * @desc    GET ALL PENDING JOIN REQUESTS FOR A COMMUNITY
 * @access  PRIVATE (AUTHENTICATED USER WITH PERMISSIONS)
 */
COMMUNITY_ROUTES.get(
  '/request-pending-community/:id',
  isAuth,
  authority,
  REQUEST_USER_IN_COMMUNITY_PENDING
);

/**
 * @route   PUT /request-confirms-community/:id
 * @desc    CONFIRM REQUEST TO A COMMUNITY
 * @access  PRIVATE (AUTHENTICATED USER)
 */
COMMUNITY_ROUTES.put(
  '/confirm-request-community/:id',
  isAuth,
  authority,
  CONFIRM_REQUEST_USER_IN_COMMUNITY
);

/**
 * @route   GET /get-community/:id
 * @desc    RETRIEVE COMMUNITY DETAILS BY ID
 * @access  PRIVATE (NOT IMPLEMENTED YET)
 */
COMMUNITY_ROUTES.get('/get-community/:id', GET_COMMUNITY);

// ----------------------
// PLACEHOLDER ROUTES (TO BE IMPLEMENTED)
// ----------------------

/**
 * @route   PUT /update-community/:id
 * @desc    UPDATE AN EXISTING COMMUNITY’S INFORMATION
 * @access  PRIVATE (NOT IMPLEMENTED YET)
 */
COMMUNITY_ROUTES.put('/update-community/:id', (req, res) => {
  res.status(501).json({ message: 'Endpoint under development' });
});





module.exports = COMMUNITY_ROUTES;
