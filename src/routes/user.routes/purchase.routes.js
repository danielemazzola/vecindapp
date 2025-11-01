const express = require('express')

// CONTROLLERS
const { PURCHASE } = require('../../controllers/purchase.controllers/purchase.controllers')

//MIDDLEWARE
const { isAuth } = require('../../middlewares/isAuth.middleware')

const PURCHASE_LICENSE = express.Router()


// PURCHASE LICENSE
PURCHASE_LICENSE.post('/purchase-license/:id', isAuth, PURCHASE)



module.exports = PURCHASE_LICENSE