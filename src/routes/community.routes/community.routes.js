const express = require('express')
const COMMUNITY_ROUTES = express.Router()

// CONTROLLERS
const { CREATE_COMMUNITY, REQUEST_USER_IN_COMMUNITY } = require('../../controllers/community.controllers/community.controllers')

// MIDDLEWARE
const { isAuth } = require('../../middlewares/isAuth.middleware')

// CONTROL IF USER IS ADMIN OR USER HAS A LICENSES
const authority = require('../../middlewares/authority.middleware')




// CREATE NEW COMMUNITY
COMMUNITY_ROUTES.post('/create-community', isAuth, authority, CREATE_COMMUNITY)

// SEND REQUEST USER -> ADD IN COMMUNITY
COMMUNITY_ROUTES.post('/request-community/:id', isAuth, REQUEST_USER_IN_COMMUNITY)

// GET COMMUNITY
COMMUNITY_ROUTES.put('/update-community/:id', () => { })

// UPDATE COMMUNITY
COMMUNITY_ROUTES.get('/get-community/:id', () => { })

module.exports = COMMUNITY_ROUTES