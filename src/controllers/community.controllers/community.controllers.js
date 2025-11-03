const fetchGeoCode = require('../../config/fetchGeoCode');
const COMMUNITY_MODEL = require('../../models/community.model');
const formatForURL = require('../../helpers/formatForURL');
const LICENSE_ASSIGNMENT = require('../../models/licenseAssignment');

const CREATE_COMMUNITY = async (req, res, next) => {
  try {
    // EXTRACT REQUIRED FIELDS FROM REQUEST BODY
    const { name, description, email, phone, address, postal_code, city, country, province } = req.body;
    const { user, license } = req;
    let updateAssignmentLicense;

    // VALIDATE REQUIRED FIELDS
    if (!name || !description || !email || !phone || !address || !postal_code || !city || !country) {
      // RETURN 400 BAD REQUEST IF ANY REQUIRED FIELD IS MISSING
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // CHECK IF LICENSE EXISTS AND HAS AVAILABLE BENEFICIARY SLOTS OR USER IS ADMIN
    if ((license && license.remainingBeneficiaries > 0) || user.roles.includes('admin')) {

      // FETCH GEOLOCATION DATA USING EXTERNAL SERVICE
      const geoData = await fetchGeoCode(
        formatForURL(province),
        formatForURL(country),
        formatForURL(address),
        formatForURL(city),
        formatForURL(postal_code)
      );

      // VALIDATE GEOLOCATION RESPONSE
      if (!geoData?.length) {
        return res.status(400).json({ message: 'Unable to fetch geolocation data. Please verify the address and try again.' });
      }

      // CREATE NEW COMMUNITY DOCUMENT
      const newCommunity = new COMMUNITY_MODEL({
        name,
        description,
        email,
        phone,
        address,
        postal_code,
        city,
        country,
        province,
        location: {
          type: 'Point',
          coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)]
        },
        creatorId: user._id
      });

      // SAVE COMMUNITY TO DATABASE
      await newCommunity.save();

      // IF USER IS NOT ADMIN, UPDATE LICENSE ASSIGNMENT
      if (!user.roles.includes('admin')) {
        updateAssignmentLicense = await LICENSE_ASSIGNMENT.findByIdAndUpdate(
          license._id,
          {
            $inc: { remainingBeneficiaries: -1 },
            $push: { "user.beneficiaries": newCommunity._id }
          },
          { new: true } // RETURN THE UPDATED DOCUMENT
        );
      }

      // RETURN SUCCESS RESPONSE WITH COMMUNITY AND UPDATED LICENSE
      return res.status(201).json({
        message: 'Community created successfully.',
        community: newCommunity,
        assignmentLicense: !user.roles.includes('admin') ? updateAssignmentLicense : null
      });
    }

    // RETURN 403 FOR LICENSE WITH NO AVAILABLE BENEFICIARY SLOTS
    return res.status(403).json({ message: 'License has no remaining beneficiary slots.' });

  } catch (error) {
    // LOG ERROR AND PASS TO GLOBAL ERROR HANDLER
    console.error('ERROR CREATE_COMMUNITY -> CONTROLLER:', error);
    next(error);
  }
};

const REQUEST_USER_IN_COMMUNITY = async (req, res, next) => {
  try {
    const { user } = req
    const { id } = req.params

    const community = await COMMUNITY_MODEL.findByIdAndUpdate(id, {
      $push: {
        pendingMembersToConfirms: user._id
      }
    }, { new: true })

    if (!community) return res.status(404).json({ message: 'Community is not exist' })
    if (!community.isActive) return res.status(404).json({ message: 'Community is not active' })

    // SEND EMAIL OR NOTIFICATION -> CAM & PRESIDENT
    // sentEmail()
    return res.status(201).json({ message: 'Request send successfull', community })

  } catch (error) {
    console.error('CONTROLLER REQUEST_USER_IN_COMMUNITY ERROR', error)
    next(error)
  }
}

module.exports = { CREATE_COMMUNITY, REQUEST_USER_IN_COMMUNITY };
