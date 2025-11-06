const fetchGeoCode = require('../../config/fetchGeoCode');
const COMMUNITY_MODEL = require('../../models/community.model');
const formatForURL = require('../../helpers/formatForURL');
const LICENSE_ASSIGNMENT = require('../../models/licenseAssignment');

/**
 * CREATE_COMMUNITY
 * Creates a new community and optionally updates license assignments.
 */
const CREATE_COMMUNITY = async (req, res, next) => {
  try {
    // EXTRACT REQUIRED FIELDS FROM REQUEST BODY
    const { name, description, email, phone, address, postal_code, city, country, province } = req.body;
    const { user, license } = req;
    let updatedLicenseAssignment;

    // VALIDATE REQUIRED FIELDS
    if (!name || !description || !email || !phone || !address || !postal_code || !city || !country) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // CHECK LICENSE AVAILABILITY OR ADMIN PRIVILEGES
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

      // UPDATE LICENSE ASSIGNMENT IF USER IS NOT ADMIN
      if (!user.roles.includes('admin')) {
        updatedLicenseAssignment = await LICENSE_ASSIGNMENT.findByIdAndUpdate(
          license._id,
          {
            $inc: { remainingBeneficiaries: -1 },
            $push: { "user.beneficiaries": newCommunity._id }
          },
          { new: true } // RETURN UPDATED DOCUMENT
        );
      }

      return res.status(201).json({
        message: 'Community created successfully.',
        community: newCommunity,
        assignmentLicense: !user.roles.includes('admin') ? updatedLicenseAssignment : null
      });
    }

    // LICENSE HAS NO AVAILABLE BENEFICIARY SLOTS
    return res.status(403).json({ message: 'License has no remaining beneficiary slots.' });

  } catch (error) {
    console.error('ERROR CREATE_COMMUNITY -> CONTROLLER:', error);
    next(error);
  }
};

/**
 * REQUEST_USER_IN_COMMUNITY
 * Allows a user to request to join a community.
 */
const REQUEST_USER_IN_COMMUNITY = async (req, res, next) => {
  try {
    const { user } = req;
    const { id } = req.params;

    const community = await COMMUNITY_MODEL.findById(id);

    if (!community) {
      return res.status(404).json({ message: 'Community does not exist.' });
    }

    if (!community.isActive) {
      return res.status(404).json({ message: 'Community is not active.' });
    }

    // CHECK IF USER HAS ALREADY REQUESTED TO JOIN
    if (community.pendingMembersToConfirms.includes(user._id)) {
      return res.status(400).json({ message: 'Request already sent. Please wait for admin or CAM confirmation.' });
    }

    // ADD USER TO PENDING MEMBERS LIST
    community.pendingMembersToConfirms.push(user._id);
    await community.save();

    // TODO: IMPLEMENT EMAIL OR NOTIFICATION FUNCTIONALITY (TO CAM & PRESIDENT)
    // e.g. sendEmailNotification(user, community);

    return res.status(201).json({
      message: 'Request sent successfully.',
      community
    });

  } catch (error) {
    console.error('CONTROLLER REQUEST_USER_IN_COMMUNITY ERROR:', error);
    next(error);
  }
};

/**
 * REQUEST_USER_IN_COMMUNITY_PENDING
 * Retrieves all pending membership requests for a given community.
 */
const REQUEST_USER_IN_COMMUNITY_PENDING = async (req, res, next) => {
  try {
    const { id } = req.params;
    const community = await COMMUNITY_MODEL.findById(id).populate({
      path: 'pendingMembersToConfirms',
      select: 'name lastname phone email'
    });

    if (!community) {
      return res.status(404).json({ message: 'Community not found.' });
    }

    return res.status(200).json({ requests: community.pendingMembersToConfirms });
  } catch (error) {
    console.error('CONTROLLER REQUEST_USER_IN_COMMUNITY_PENDING ERROR:', error);
    next(error);
  }
};

/**
 * RETRIEVE COMMUNITY DETAILS BY ID
 */
const GET_COMMUNITY = async (req, res, next) => {
  try {
    const { id } = req.params
    const community = await COMMUNITY_MODEL.findById(id)
    if (!community) return res.status(404).json({ message: 'Communito not found' })
    return res.status(201).json(community)
  } catch (error) {
    console.error('ERROR CONTROLLER -> GET_COMMUNITY', error)
    next(error)
  }
}

module.exports = {
  CREATE_COMMUNITY,
  REQUEST_USER_IN_COMMUNITY,
  REQUEST_USER_IN_COMMUNITY_PENDING,
  GET_COMMUNITY
};
