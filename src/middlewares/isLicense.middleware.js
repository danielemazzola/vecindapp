const isLicense = async (req, res, next) => {
  // CHECK LICENSE MIDDLEWARE
  try {
    const { id } = req.paramas
    const license = await LICENSE_MODEL.findById(id)
    if (!license) return res.status(404), json({ message: 'License not found' })
    req.license = license
    next()
  } catch (error) {
    console.error('ERROR MIDDLEWARE ISLICENSE', error)
    next(error)
  }
  // END CHECK LICENSE MIDDLEWARE

}

module.exports = isLicense