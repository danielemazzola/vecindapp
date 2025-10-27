require('dotenv').config();
const EXPRESS = require('express');
const CORS = require('cors');

// ROUTES
const ENV = require('./src/config/config.env');
const CONNECT_CLOUDINARY = require('./src/config/cloudinary');
const CONNECT_DDBB = require('./src/config/connectDDBB');

const APP = EXPRESS();
APP.use(CORS());
APP.use(EXPRESS.json());
APP.use(EXPRESS.urlencoded({ extended: true }));

// CONNECTS
CONNECT_DDBB()

// CLOUDINARY
CONNECT_CLOUDINARY()

// MAIN ROUTES
const ROUTES = require('./src/routes/main.routes');
APP.use('/api', ROUTES);

// ERROR MANAGEMENT
APP.use((req, res, next) => {
  const error = new Error('Route does not exist. Please contact support.');
  error.status = 404;
  next(error);
});
APP.use((error, req, res, next) => {
  console.error('Error: ', error.message);
  return res.status(error.status || 500).json({
    message:
      error.message ||
      'There was a problem with the server. Please try again later.',
  });
});

// CONNECTION
APP.listen((ENV.PORT), () => {
  console.log(`Server running on port ${ENV.PORT}`);
});