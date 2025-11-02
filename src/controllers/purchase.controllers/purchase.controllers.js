const LICENSE_ASSIGNMENT = require("../../models/licenseAssignment");

const PURCHASE = async (req, res, next) => {
  try {
    // PAYMENT
    // Aquí iría la lógica del pago
    // END PAYMENT

    const { user, license } = req;

    if (!license || !user) {
      return res.status(400).json({ message: "Missing license or user information." });
    }

    if (!license.isActive) return res.status(401).json({ message: 'License is inactive.' })

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (license.durationDays || 0));

    const assignmentLicense = new LICENSE_ASSIGNMENT({
      license: license._id,
      remainingBeneficiaries: license.userType === "esp" ? license.limits.maxAdmins - 1 : license.limits.maxCommunities,
      endDate: endDate.toISOString(),
      user: {
        owner: user._id,
        beneficiaryType: license.userType === "cam" ? "communities" : "users",
        beneficiaries: license.userType === "esp" ? [user._id] : []
      },
    });

    await assignmentLicense.save();

    if (!assignmentLicense) {
      return res
        .status(500)
        .json({ message: "The system did not create an assignment license. Please try again." });
    }

    return res
      .status(201)
      .json({ message: "Purchase license successfully", myLicenses: assignmentLicense });
  } catch (error) {
    console.error("ERROR CONTROLLER PURCHASE", error);
    next(error);
  }
};

module.exports = {
  PURCHASE,
};
