const express = require('express');
const { CREATE_LICENSE } = require('../../controllers/license.controller/license.controller');
const { isAuth } = require('../../middlewares/isAuth.middleware');
const { isAdmin } = require('../../middlewares/isAdmin');
const LICENSE_ROUTES = express.Router();

LICENSE_ROUTES.post('/create-license', isAuth, isAdmin, CREATE_LICENSE)

module.exports = LICENSE_ROUTES;