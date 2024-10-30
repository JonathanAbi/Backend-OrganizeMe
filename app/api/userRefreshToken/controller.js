const { StatusCodes } = require("http-status-codes");
const {
  getUserRefreshToken,
  deleteUserRefreshToken,
} = require("../../services/mongoose/refreshToken");

const index = async (req, res, next) => {
  try {
    const result = await getUserRefreshToken(req);

    res.status(StatusCodes.OK).json({
      data: { token: result },
    });
  } catch (err) {
    console.log("err");
    console.log(err);
    next(err);
  }
};
const destroy = async (req, res, next) => {
  try {
    const result = await deleteUserRefreshToken(req);

    res.status(StatusCodes.OK).json({
      data: result,
      msg: "Succesfully logout"
    });
  } catch (err) {
    console.log("err");
    console.log(err);
    next(err);
  }
};

module.exports = { index, destroy };
