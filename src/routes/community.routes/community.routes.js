const express = require('express')
const COMMUNITY_ROUTES = express.Router()
const { CREATE_COMMUNITY } = require('../../controllers/community.controllers/community.controllers')
const { isAuth } = require('../../middlewares/isAuth.middleware')

// CONTROL IF USER IS ADMIN OR USER HAS A LICENSES
const authority = require('../../middlewares/authority')




// CREATE NEW COMMUNITY
COMMUNITY_ROUTES.post('/create-community', isAuth, authority, CREATE_COMMUNITY)

// GET COMMUNITY
COMMUNITY_ROUTES.put('/update-community/:id', () => {})

// UPDATE COMMUNITY
COMMUNITY_ROUTES.get('/get-community/:id', () => {})

module.exports = COMMUNITY_ROUTES