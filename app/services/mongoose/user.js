const User = require("../../api/auth/model");

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../../errors");
const { createTokenUser, createJWT, createRefreshJWT } = require("../../utils");
const { sendOtpEmail } = require("../email");
const { createUserRefreshToken } = require("./refreshToken");

const signUpUser = async (req) => {
  const { username, email, password } = req.body;

  let result = await User.findOne({
    username,
    email,
    isVerified: false,
  });

  if (result) {
    throw new BadRequestError("User is registered, please verify OTP");
  } else {
    result = await User.create({
      username,
      email,
      password,
      otpCode: Math.floor(100000 + Math.random() * 900000).toString(),
      otpExpiresAt: Date.now() + 10 * 60 * 1000, // OTP valid selama 10 menit
    });
  }
  await sendOtpEmail(email, result);
  delete result._doc.password;
  delete result._doc.otpCode;
  return result;
};

const signInUser = async (req) => {
  const { email, password } = req.body;
  const result = await User.findOne({
    email,
  });
  if (!result) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  if (result.isVerified === false) {
    throw new UnauthorizedError("Your account is not active");
  }
  const isPasswordCorrect = await result.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  const token = createJWT({ payload: createTokenUser(result) });
  const refreshToken = createRefreshJWT({ payload: createTokenUser(result) });

  await createUserRefreshToken({
    refreshToken,
    user: result._id
  })

  return { token, email: result.email, username: result.username, refreshToken};
};

const verifyOtp = async (req) => {
  const { email, otpCode } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError("User not found");

  if (user.isVerified) throw new BadRequestError("User already verified");
  if (user.otpCode === otpCode && user.otpExpiresAt > Date.now()) {
    user.isVerified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    delete user._doc.password;
    return user;
  } else {
    throw new BadRequestError("Invalid or expired OTP");
  }
};

const resendOtp = async (req) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError("User not found");

  if (user.isVerified) throw new BadRequestError("User already verified");

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = Date.now() + 10 * 60 * 1000;

  user.otpCode = otpCode;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();

  await sendOtpEmail(email, user);
  delete user._doc.password;
  delete user._doc.otpCode;
  return user;
};
module.exports = {
  signUpUser,
  verifyOtp,
  resendOtp,
  signInUser
};
