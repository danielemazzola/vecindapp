const express = require('express');
const MAIN_ROUTES = express.Router();

const USER_ROUTES = require('./user.routes/user.routes');
const COUNTRY_ROUTES = require('./country.routes/country.routes');
const LICENSE_ROUTES = require('./license.routes/license.routes');
const COMMUNITY_ROUTES = require('./community.routes/community.routes');

// USER ROUTES
MAIN_ROUTES.use('/users', USER_ROUTES);

// COUNTRY ROUTES
MAIN_ROUTES.use('/countries', COUNTRY_ROUTES);

// LICENSES ROUTES
MAIN_ROUTES.use('/licenses', LICENSE_ROUTES);

// COMMUNITY ROUTES
MAIN_ROUTES.use('/community', COMMUNITY_ROUTES);

module.exports = MAIN_ROUTES;