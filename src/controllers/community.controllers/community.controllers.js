const fetchGeoCode = require('../../config/fetchGeoCode');
const COMMUNITY_MODEL = require('../../models/community.model');
const formatForURL = require('../../helpers/formatForURL');
const LICENSE_ASSIGNMENT = require('../../models/licenseAssignment');

const CREATE_COMMUNITY = async (req, res, next) => {
  try {
    const { name, description, email, phone, address, postal_code, city, country, province } = req.body;
    const { user, roleType, licenseAssignments } = req;

    // Validar campos requeridos
    if (!name || !description || !email || !phone || !address || !postal_code || !city || !country) {
      return res.status(400).json({ message: 'All marked fields are required.' });
    }

    // Geocodificación
    const geoData = await fetchGeoCode(
      formatForURL(province),
      formatForURL(country),
      formatForURL(address),
      formatForURL(city),
      formatForURL(postal_code)
    );

    if (!geoData?.length) {
      return res.status(400).json({ message: 'Unable to fetch geolocation data. Please check the address information and try again.' });
    }

    // Crear comunidad
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

    await newCommunity.save();

    // Si es CAM, añadir a beneficiarios
    if (roleType === 'cam') {
      const assignment = licenseAssignments[0]; // usa la primera licencia válida
      assignment.camType.beneficiaries.push(newCommunity._id);
      assignment.remainingBeneficiaries =+ 1
      await assignment.save();
    }

    return res.status(201).json({
      message: 'Community created successfully',
      community: newCommunity
    });

  } catch (error) {
    console.error('ERROR CREATE_COMMUNITY -> CONTROLLER:', error);
    next(error);
  }
};

module.exports = { CREATE_COMMUNITY };
