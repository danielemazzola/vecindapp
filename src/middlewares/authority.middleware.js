// AUTHORITY MIDDLEWARE
// -------------------------------------------------------------
// PURPOSE:
// THIS MIDDLEWARE CHECKS IF THE AUTHENTICATED USER HAS THE
// REQUIRED PRIVILEGES TO PERFORM CERTAIN ACTIONS.
//
// LOGIC FLOW:
// 1. IF THE USER HAS AN "ADMIN" ROLE → ACCESS IS GRANTED IMMEDIATELY.
// 2. OTHERWISE, THE MIDDLEWARE VERIFIES WHETHER THE USER HAS
//    A VALID LICENSE (BY LICENSE ID) WITH PERMISSION FOR COMMUNITIES.
// -------------------------------------------------------------

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const LICENSE_ASSIGNMENT = require("../models/licenseAssignment");

const authority = async (req, res, next) => {
  try {
    const { user } = req;
    const { licenseId } = req.body;

    // STEP 0: VALIDATE THAT LICENSE ID IS PROVIDED
    if (!licenseId && !user.roles.includes('admin')) {
      return res.status(400).json({ message: 'A license must be selected.' });
    }

    // STEP 1: CHECK IF USER HAS ADMIN ROLE
    // --------------------------------------
    // IF THE USER HAS AN "ADMIN" ROLE, GRANT ACCESS IMMEDIATELY
    if (user.roles.includes('admin')) {
      req.roleType = 'admin';
      return next();
    }

    // STEP 2: VALIDATE LICENSE ID FORMAT
    // -----------------------------------
    // ENSURE THE PROVIDED LICENSE ID IS A VALID MONGODB OBJECTID
    if (!mongoose.isValidObjectId(licenseId)) {
      return res.status(400).json({ message: 'Invalid license ID format.' });
    }

    // STEP 3: FIND LICENSE BY ID AND POPULATE REFERENCE
    // -------------------------------------------------
    const checkLicense = await LICENSE_ASSIGNMENT.findById(new ObjectId(licenseId)).populate('license');


    // STEP 4: VERIFY LICENSE EXISTS
    if (!checkLicense) {
      return res.status(403).json({ message: 'No license found with the provided ID.' });
    }

    // VERIFY LICENSE OWNER
    if (!checkLicense.user.owner.equals(user._id)) {
      return res.status(403).json({ message: 'You are not authorized to use this license.' });
    }

    // STEP 5: VERIFY LICENSE IS ACTIVE
    if (!checkLicense.isActive) {
      return res.status(403).json({ message: 'This license is not active.' });
    }

    // STEP 6: VERIFY LICENSE PERMISSION FOR COMMUNITIES
    if (checkLicense.user.beneficiaryType !== 'communities') {
      return res.status(403).json({ message: 'This license does not have permission for communities.' });
    }

    // STEP 7: ATTACH LICENSE TO REQUEST OBJECT FOR NEXT MIDDLEWARE/CONTROLLER
    req.license = checkLicense;
    next();

  } catch (error) {
    // STEP 8: ERROR HANDLING
    // ----------------------
    // LOG ERROR TO CONSOLE AND PASS TO GLOBAL ERROR HANDLER
    console.error('ERROR authority -> MIDDLEWARE', error);
    next(error);
  }
};

module.exports = authority;
