const express = require('express');
const USER_ROUTES = express.Router();

// ----------------------
// CONTROLLERS
// ----------------------
const { 
  CREATE_USER, 
  LOGIN_USER, 
  UPDATE_USER, 
  PROFILE_USER, 
  UPDATE_AVATAR, 
  UPDATE_USER_ADMIN 
} = require('../../controllers/user.controllers/user.controllers');

// ----------------------
// MIDDLEWARES
// ----------------------
const { isAuth } = require('../../middlewares/isAuth.middleware'); // CHECKS IF USER IS AUTHENTICATED
const { userAvatar } = require('../../middlewares/checkAvatar.middleware'); // HANDLES AVATAR UPLOAD
const { isAdmin } = require('../../middlewares/isAdmin.middleware'); // CHECKS IF USER IS ADMIN

// ----------------------
// USER ROUTES
// ----------------------

/**
 * @route   POST /create-user
 * @desc    CREATE A NEW USER
 * @access  PUBLIC
 */
USER_ROUTES.post('/create-user', CREATE_USER);

/**
 * @route   POST /login
 * @desc    LOGIN USER
 * @access  PUBLIC
 */
USER_ROUTES.post('/login', LOGIN_USER);

/**
 * @route   PUT /update-profile
 * @desc    UPDATE AUTHENTICATED USER PROFILE
 * @access  PRIVATE (AUTHENTICATED USER)
 */
USER_ROUTES.put('/update-profile', isAuth, UPDATE_USER);

/**
 * @route   PUT /update-user/:id
 * @desc    UPDATE USER PROFILE BY ADMIN
 * @access  PRIVATE (AUTHENTICATED ADMIN)
 */
USER_ROUTES.put('/update-user/:id', isAuth, isAdmin, UPDATE_USER_ADMIN);

/**
 * @route   GET /profile
 * @desc    GET AUTHENTICATED USER PROFILE
 * @access  PRIVATE (AUTHENTICATED USER)
 */
USER_ROUTES.get('/profile', isAuth, PROFILE_USER);

/**
 * @route   PUT /update-avatar/:id
 * @desc    UPDATE USER AVATAR BY ID
 * @access  PRIVATE (AUTHENTICATED USER)
 */
USER_ROUTES.put('/update-avatar/:id', isAuth, userAvatar.single('vcd_avatar'), UPDATE_AVATAR);

module.exports = USER_ROUTES;
