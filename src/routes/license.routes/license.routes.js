const express = require('express');
const LICENSE_ROUTES = express.Router();
const { CREATE_LICENSE, UPDATE_LICENSE } = require('../../controllers/license.controller/license.controller');
const { isAuth } = require('../../middlewares/isAuth.middleware');
const { isAdmin } = require('../../middlewares/isAdmin');

LICENSE_ROUTES.post('/create-license', isAuth, isAdmin, CREATE_LICENSE)
LICENSE_ROUTES.post('/update-license/:id', isAuth, isAdmin, UPDATE_LICENSE)

module.exports = LICENSE_ROUTES;