const { StatusCodes } = require("http-status-codes");
const {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
  getOneTask,
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
    const result = await getAllTasks(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    console.log("err");
    console.log(err);
    next(err);
  }
};
const getOne = async (req, res, next) => {
  try {
    const result = await getOneTask(req);

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
  update,
  getOne
};
