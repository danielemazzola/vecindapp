const express = require('express');
const USER_ROUTES = express.Router();

// CONTROLLERS
const { CREATE_USER, LOGIN_USER, UPDATE_USER, PROFILE_USER, UPDATE_AVATAR, UPDATE_USER_ADMIN } = require('../../controllers/user.controllers/user.controllers');

// MIDDLEWARES
const { isAuth } = require('../../middlewares/isAuth.middleware');
const { userAvatar } = require('../../middlewares/checkAvatar.middleware');
const { isAdmin } = require('../../middlewares/isAdmin.middleware');


// CREATE USER
USER_ROUTES.post('/create-user', CREATE_USER);

// LOGIN USER
USER_ROUTES.post('/login', LOGIN_USER);

// UPDATE USER
USER_ROUTES.put('/update-profile', isAuth, UPDATE_USER);
USER_ROUTES.put('/update-user/:id', isAuth, isAdmin, UPDATE_USER_ADMIN);

// GET USERS
USER_ROUTES.get('/profile', isAuth, PROFILE_USER);

// UPDATE AVATAR
USER_ROUTES.put('/update-avatar/:id', isAuth, userAvatar.single('vcd_avatar'), UPDATE_AVATAR);

module.exports = USER_ROUTES;