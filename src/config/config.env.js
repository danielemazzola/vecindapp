module.exports = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GEO_API_KEY: process.env.GEO_API_KEY,

  // ----------------------
  // Cloudinary configuration
  // ----------------------
  CLOUDINARY: {
    name: process.env.CLOUDINARY_NAME,
    secret: process.env.CLOUDINARY_SECRET,
    key: process.env.CLOUDINARY_KEY,
  },

  // ----------------------
  // Stripe configuration
  // ----------------------
  STRIPE: {
    secret_key: process.env.STRIPE_SECRET_KEY, // Secret key for Stripe API
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET, // Webhook signing secret
    frontend_url: process.env.FRONTEND_URL, // URL of frontend to redirect after payment
  },
}
