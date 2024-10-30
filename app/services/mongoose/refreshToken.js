const UserRefreshToken = require("../../api/userRefreshToken/model");
const {
  isTokenValidRefreshToken,
  createJWT,
  createTokenUser,
} = require("../../utils");
const Users = require("../../api/auth/model");
const { NotFoundError, BadRequestError } = require("../../errors");

const createUserRefreshToken = async (payload) => {
  const result = await UserRefreshToken.create(payload);

  return result;
};

const getUserRefreshToken = async (req) => {
  const { refreshToken, email } = req.params;
  const result = await UserRefreshToken.findOne({
    refreshToken,
  });

  if (!result) throw new NotFoundError("Refresh Token not valid");

  const payload = isTokenValidRefreshToken({ token: result.refreshToken });

  if (email !== payload.email) {
    throw new BadRequestError("Email not valid");
  }

  const userCheck = await Users.findOne({ email: payload.email });

  const token = createJWT({ payload: createTokenUser(userCheck) });

  return token;
};

const deleteUserRefreshToken = async (req) => {
  const { userId } = req.user;
  console.log(userId);
  const result = UserRefreshToken.deleteOne({ user: userId });

  return result;
};
module.exports = {
  createUserRefreshToken,
  getUserRefreshToken,
  deleteUserRefreshToken,
};
