const isAdmin = (req, res, next) => {
  try {
    const { user } = req
    if (!user.roles.includes( 'admin')) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next()
  } catch (error) {
    console.error('Error in isAdmin middleware:', error);
    next(error);
  }
}

module.exports = { isAdmin };