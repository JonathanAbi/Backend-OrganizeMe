const { signUpUser, verifyOtp, resendOtp, signInUser} = require("../../services/mongoose/user");
const { StatusCodes } = require("http-status-codes");

const signUp = async (req, res, next) => {
  try {
    const result = await signUpUser(req);
    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const signIn = async (req, res, next) => {
  try {
    const result = await signInUser(req);
    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const result = await verifyOtp(req);
    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const resendOtpUser = async (req, res, next) => {
  try {
    const result = await resendOtp(req);
    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signUp,
  verifyUser,
  resendOtpUser,
  signIn
};
