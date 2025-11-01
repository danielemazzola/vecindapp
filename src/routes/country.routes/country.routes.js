const express = require('express');
const COUNTRY_ROUTES = express.Router();

// CONTROLLERS
const { CREATE_COUNTRY, UPDATE_COUNTRY, GET_COUNTRIES } = require('../../controllers/country.controllers/country.controllers');

// MIDDLEWARES
const { isAuth } = require('../../middlewares/isAuth.middleware');
const { isAdmin } = require('../../middlewares/isAdmin.middleware');

// CREATE COUNTRY
COUNTRY_ROUTES.post('/create-country', isAuth, isAdmin, CREATE_COUNTRY);

// UPDATE COUNTRY
COUNTRY_ROUTES.put('/update-country/:id', isAuth, isAdmin, UPDATE_COUNTRY)

// GET COUNTRY
COUNTRY_ROUTES.get('/get-countries', GET_COUNTRIES)

module.exports = COUNTRY_ROUTES;