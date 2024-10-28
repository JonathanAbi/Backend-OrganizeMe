const { UnauthorizedError, UnauthenticatedError } = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    } else {
      throw new UnauthenticatedError("Authentication invalid");
    }
    const payload = isTokenValid({ token });
    req.user = {
      email: payload.email,
      username: payload.username,
      userId: payload.userId,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateUser,
};
