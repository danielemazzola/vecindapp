const LICENSE_MODEL = require("../models/license.model");

// ----------------------
// ISLICENSE MIDDLEWARE
// ----------------------
// THIS MIDDLEWARE CHECKS IF THE LICENSE EXISTS BY ID
// IT ATTACHES THE LICENSE TO req.license IF FOUND
const isLicense = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ----------------------
    // FETCH LICENSE FROM DATABASE
    // ----------------------
    const license = await LICENSE_MODEL.findById(id);

    // ----------------------
    // CHECK IF LICENSE EXISTS
    // ----------------------
    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    // ----------------------
    // ATTACH LICENSE TO REQUEST
    // ----------------------
    req.license = license;
    next(); // LICENSE FOUND, PROCEED TO NEXT MIDDLEWARE
  } catch (error) {
    console.error('ERROR MIDDLEWARE ISLICENSE', error);
    next(error);
  }
};

// ----------------------
// EXPORT
// ----------------------
module.exports = isLicense;
