// AUTHORITY MIDDLEWARE
// -------------------------------------------------------------
// PURPOSE:
// This middleware checks if the authenticated user has the
// required privileges to perform certain actions.
//
// LOGIC FLOW:
// 1. If the user has an "admin" role → access is granted immediately.
// 2. Otherwise, the middleware verifies whether the user has at least
//    one valid "CAM-type" license with available beneficiary slots.
// -------------------------------------------------------------
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const LICENSE_ASSIGNMENT = require("../models/licenseAssignment");

const authority = async (req, res, next) => {
  try {
    const { user } = req;
    const { licenseId } = req.body

    // STEP 1: CHECK IF USER IS ADMIN
    // --------------------------------
    // If the user has the "admin" role, grant access immediately.
    // The `return` ensures that execution stops here.
    if(!licenseId) {
      return res.status(403).json({ message: 'You need to select a license.' }); 
    }

    if (user.roles.includes('admin')) {
      req.roleType = 'admin';
      return next();
    }


    // STEP 2: FIND licenseId
    const checkLicense = await LICENSE_ASSIGNMENT.findById(new ObjectId(licenseId)).populate('license')
    console.log(checkLicense);
    
    if (!checkLicense) {
      return res.status(403).json({ message: 'No active licenses found for this user.' });
    }
    if (!checkLicense.isActive) {
      return res.status(200).json({ message: 'License in not active.' });
    }

    if(checkLicense.user.beneficiaryType !== 'communities') {
      return res.status(200).json({ message: 'License not permited!' });
    }
    // --------------------------------

    req.license = checkLicense
    next()
  } catch (error) {
    // ERROR HANDLING
    // --------------------------------
    // Logs the error to the console and passes it to the global error handler.
    console.error('ERROR authority -> MIDDLEWARE', error);
    next(error);
  }
};

module.exports = authority;
