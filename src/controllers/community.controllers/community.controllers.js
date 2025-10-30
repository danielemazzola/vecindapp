const fetchGeoCode = require('../../config/fetchGeoCode');
const COMMUNITY_MODEL = require('../../models/community.model');
const formatForURL = require('../../helpers/formatForURL');

const CREATE_COMMUNITY = async (req, res, next) => {
  try {
    const { name, description, email, phone, address, postal_code, city, country, province } = req.body;
    const { user } = req
    if (!name || !description || !email || !phone || !address || !postal_code || !city || !country) {
      return res.status(400).json({
        message: 'All marked fields are required'
      });
    }

    const newCountry = formatForURL(country)
    const newCity = formatForURL(city);
    const newAddress = formatForURL(address);
    const newPC = formatForURL(postal_code);
    const newProvince = formatForURL(province);
    const geocodeData = await fetchGeoCode(newProvince, newCountry, newAddress, newCity, newPC);

    if (!geocodeData) {
      return res.status(400).json({ message: 'Unable to fetch geolocation data. Please check the address information and try again.' });
    }

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
        coordinates: [parseFloat(geocodeData[0].lon), parseFloat(geocodeData[0].lat)]
      },
      creatorId: user._id
    });

    await newCommunity.save();

    return res.status(201).json({
      message: 'Community created successfully',
      community: newCommunity
    });

  } catch (error) {
    console.error('ERROR CREATE_COMMUNITY -> CONTROLLER:', error);
    next(error)
  }
};

module.exports = {
  CREATE_COMMUNITY
};