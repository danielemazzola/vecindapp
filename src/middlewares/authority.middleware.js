const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const LICENSE_ASSIGNMENT = require('../models/license-assignment.model')

// ----------------------
// AUTHORITY MIDDLEWARE
// ----------------------
// THIS MIDDLEWARE CHECKS IF THE USER HAS AUTHORITY TO ACCESS A LICENSE
// IT VALIDATES THE LICENSE ID, OWNERSHIP, ACTIVE STATUS, AND PERMISSIONS
const authority = async (req, res, next) => {
  try {
    const { user } = req
    const { licenseId } = req.body

    // ----------------------
    // CHECK IF LICENSE ID IS PROVIDED OR USER IS ADMIN
    // ----------------------
    if (!licenseId && !user.roles.includes('admin')) {
      return res.status(400).json({ message: 'A license must be selected.' })
    }

    // ----------------------
    // ADMIN BYPASS
    // ----------------------
    if (user.roles.includes('admin')) {
      req.roleType = 'admin'
      return next()
    }

    // ----------------------
    // VALIDATE LICENSE ID FORMAT
    // ----------------------
    if (!mongoose.isValidObjectId(licenseId)) {
      return res.status(400).json({ message: 'Invalid license ID format.' })
    }

    // ----------------------
    // FETCH LICENSE FROM DATABASE
    // ----------------------
    const checkLicense = await LICENSE_ASSIGNMENT.findById(
      new ObjectId(licenseId),
    ).populate('license')

    if (!checkLicense) {
      return res
        .status(403)
        .json({ message: 'No license found with the provided ID.' })
    }

    // ----------------------
    // CHECK LICENSE OWNERSHIP
    // ----------------------
    if (!checkLicense.user.owner.equals(user._id)) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to use this license.' })
    }

    // ----------------------
    // CHECK LICENSE ACTIVE STATUS
    // ----------------------
    if (!checkLicense.isActive) {
      return res.status(403).json({ message: 'This license is not active.' })
    }

    // ----------------------
    // CHECK LICENSE PERMISSION FOR COMMUNITIES
    // ----------------------
    if (checkLicense.user.beneficiaryType !== 'communities') {
      return res.status(403).json({
        message: 'This license does not have permission for communities.',
      })
    }

    // ----------------------
    // ATTACH LICENSE TO REQUEST OBJECT
    // ----------------------
    req.license = checkLicense
    next()
  } catch (error) {
    console.error('ERROR authority -> MIDDLEWARE', error)
    next(error)
  }
}

module.exports = authority
