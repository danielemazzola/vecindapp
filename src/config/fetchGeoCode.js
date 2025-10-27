const config = require('../config/config.env');

const fetchGeoCode = async (newCountry, newAddress, newCity, newPC) => {
  try {
    const GEO_API_KEY = config.geoApiKey;
    const GEO_URI = `https://geocode.maps.co/search?country=${newCountry}&street=${newAddress}&city=${newCity}&postalcode=${newPC}&api_key=${GEO_API_KEY}`;
    const response = await fetch(GEO_URI);
    const data = await response.json();
    return data.length ? data : null;
  } catch (error) {
    console.error(`Error fetching geocode: ${error.message}`);
    return null;
  }
};
module.exports = fetchGeoCode;
