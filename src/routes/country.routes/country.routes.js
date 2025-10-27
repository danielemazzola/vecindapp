const exprees = require('express');
const COUNTRY_ROUTES = exprees.Router();

// CONTROLLERS
const { CREATE_COUNTRY, UPDATE_COUNTRY } = require('../../controllers/country.controllers/country.controllers');

// MIDDLEWARES
const { isAuth } = require('../../middlewares/isAuth.middleware');
const { isAdmin } = require('../../middlewares/isAdmin');

// CREATE COUNTRY
COUNTRY_ROUTES.post('/create-country', isAuth, isAdmin, CREATE_COUNTRY);

//UPDATE COUNTRY
COUNTRY_ROUTES.put('/update-country/:id', isAuth, isAdmin, UPDATE_COUNTRY)

module.exports = COUNTRY_ROUTES;