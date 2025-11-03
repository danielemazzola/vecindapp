const LICENSE_ASSIGNMENT = require("../../models/licenseAssignment");

/**
 * PURCHASE
 * Handles the purchase of a license and creates its assignment record.
 */
const PURCHASE = async (req, res, next) => {
  try {
    // TODO: IMPLEMENT PAYMENT LOGIC HERE
    // e.g. Integrate with Stripe, PayPal, or internal payment system
    // END PAYMENT LOGIC

    const { user, license } = req;

    // VALIDATE REQUIRED DATA
    if (!user || !license) {
      return res.status(400).json({ message: "Missing user or license information." });
    }

    if (!license.isActive) {
      return res.status(401).json({ message: "The selected license is inactive." });
    }

    // CALCULATE LICENSE DURATION
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (license.durationDays || 0));

    // CALCULATE REMAINING BENEFICIARIES BASED ON LICENSE TYPE
    const remainingBeneficiaries =
      license.userType === "esp"
        ? (license.limits?.maxAdmins || 0) - 1
        : license.limits?.maxCommunities || 0;

    // CREATE LICENSE ASSIGNMENT DOCUMENT
    const assignmentLicense = new LICENSE_ASSIGNMENT({
      license: license._id,
      remainingBeneficiaries,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      user: {
        owner: user._id,
        beneficiaryType: license.userType === "cam" ? "communities" : "users",
        beneficiaries: license.userType === "esp" ? [user._id] : []
      }
    });

    const savedAssignment = await assignmentLicense.save();

    if (!savedAssignment) {
      return res.status(500).json({
        message: "The system failed to create a license assignment. Please try again."
      });
    }

    // TODO: SEND EMAIL CONFIRMATION OR NOTIFICATION TO USER
    // e.g. sendPurchaseConfirmation(user.email, license);

    return res.status(201).json({
      message: "License purchased successfully.",
      myLicense: savedAssignment
    });

  } catch (error) {
    console.error("ERROR IN PURCHASE CONTROLLER:", error);
    next(error);
  }
};

module.exports = {
  PURCHASE
};
