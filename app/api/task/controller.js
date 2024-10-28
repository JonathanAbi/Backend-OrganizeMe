const { StatusCodes } = require("http-status-codes");
const {
  createTask,
  deleteTask,
  getAllTask,
  updateTask,
} = require("../../services/mongoose/tasks");

const create = async (req, res, next) => {
  try {
    const result = await createTask(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    console.log("err");
    console.log(err);
    next(err);
  }
};
const destroy = async (req, res, next) => {
  try {
    const result = await deleteTask(req);

    res.status(StatusCodes.OK).json({
      data: result,
      msg: "Task deleted",
    });
  } catch (err) {
    console.log("err");
    console.log(err);
    next(err);
  }
};
const getAll = async (req, res, next) => {
  try {
    const result = await getAllTask(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    console.log("err");
    console.log(err);
    next(err);
  }
};
const update = async (req, res, next) => {
  try {
    const result = await updateTask(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    console.log("err");
    console.log(err);
    next(err);
  }
};

module.exports = {
  create,
  destroy,
  getAll,
  update
};
