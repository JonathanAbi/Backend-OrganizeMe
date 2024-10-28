const dotenv = require("dotenv").config();

module.exports = {
  urlDb: process.env.URL_MONGODB_DEV,
  jwtExpiration: process.env.JWT_EXPIRATION,
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtRefreshTokenSecret: process.env.JWT_SECRET_KEY_REFRESH_TOKEN,
  jwtRefreshTokenExpiration: process.env.JWT_EXPIRATION_REFRESH_TOKEN,
  email_user: process.env.EMAIL,
  password_user: process.env.PASSWORD
};
