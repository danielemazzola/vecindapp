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

const LICENSE_ASSIGNMENT = require("../models/licenseAssignment");

const authority = async (req, res, next) => {
  try {
    const { user } = req;

    // STEP 1: CHECK IF USER IS ADMIN
    // --------------------------------
    // If the user has the "admin" role, grant access immediately.
    // The `return` ensures that execution stops here.
    if (user.roles.includes('admin')) {
      return next();
    }

    // STEP 2: FIND ALL LICENSE ASSIGNMENTS FOR THE USER
    // --------------------------------
    // Look up all license assignments associated with the user's ID.
    // The `.populate('license')` call automatically retrieves
    // the referenced license document to avoid a second query.
    const assignments = await LICENSE_ASSIGNMENT.find({ user: user._id }).populate('license');

    if (!assignments.length) {
      return res.status(403).json({ message: 'No licenses found for this user.' });
    }

    // STEP 3: FILTER LICENSES THAT ARE CAM-TYPE
    // --------------------------------
    // Only users with a CAM-type license can proceed.
    const camLicenses = assignments.filter(l => l.camType === true);

    if (!camLicenses.length) {
      return res.status(403).json({ message: 'You do not have any CAM-type licenses.' });
    }

    // STEP 4: VALIDATE LICENSE REFERENCE
    // --------------------------------
    // Since licenses are populated, we can directly access the license object.
    const license = camLicenses[0].license;

    if (!license) {
      return res.status(403).json({ message: 'Associated license not found.' });
    }

    // STEP 5: CHECK LICENSE CAPACITY
    // --------------------------------
    // Verify if there is remaining capacity (beneficiaries)
    // available within the license limits.
    const hasAvailableSlots = camLicenses.some(
      l => l.remainingBeneficiaries < license.limits.maxCommunities
    );

    if (!hasAvailableSlots) {
      return res.status(403).json({ message: 'No remaining capacity to create a new community.' });
    }

    // STEP 6: GRANT ACCESS
    // --------------------------------
    // All checks passed — allow request to continue.
    next();

  } catch (error) {
    // ERROR HANDLING
    // --------------------------------
    // Logs the error to the console and passes it to the global error handler.
    console.error('ERROR authority -> MIDDLEWARE', error);
    next(error);
  }
};

module.exports = authority;
