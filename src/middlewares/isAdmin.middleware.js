// ----------------------
// ISADMIN MIDDLEWARE
// ----------------------
// THIS MIDDLEWARE CHECKS IF THE AUTHENTICATED USER HAS THE 'ADMIN' ROLE
// IT DENIES ACCESS IF THE USER IS NOT AN ADMIN
const isAdmin = (req, res, next) => {
  try {
    const { user } = req;

    // ----------------------
    // CHECK ADMIN ROLE
    // ----------------------
    if (!user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next(); // USER IS ADMIN, PROCEED TO NEXT MIDDLEWARE
  } catch (error) {
    console.error('ERROR in isAdmin middleware:', error);
    next(error);
  }
};

// ----------------------
// EXPORT
// ----------------------
module.exports = { isAdmin };
