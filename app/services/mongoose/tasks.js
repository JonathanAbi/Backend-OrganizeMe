const Task = require("../../api/task/model");
const User = require("../../api/auth/model");

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  UnauthenticatedError,
} = require("../../errors");

const getAllTask = async (req) => {
  if (!req.user || !req.user.userId) {
    throw new UnauthenticatedError("User is not authenticated.");
  }
  const result = await Task.find({ userId: req.user.userId });
  return result;
};

const getOneTask = async (req) => {
  if (!req.user || !req.user.userId) {
    throw new UnauthenticatedError("User is not authenticated.");
  }
  const { id } = req.params;
  const result = await Task.findById(id);
  return result;
};

const createTask = async (req) => {
  if (!req.user || !req.user.userId) {
    throw new UnauthenticatedError("User is not authenticated.");
  }
  const { title, description, dueDate, priority } = req.body;

  const result = await Task.create({
    userId: req.user.userId,
    title,
    description,
    dueDate,
    priority,
  });

  const user = await User.findById(req.user.userId);

  if (user) {
    user.tasks.push(result._id);
    await user.save();
  }

  return result;
};

const updateTask = async (req) => {
  if (!req.user || !req.user.userId) {
    throw new UnauthenticatedError("User is not authenticated.");
  }
  const { id } = req.params;
  const { title, description, dueDate, priority, status } = req.body;
  const userId = req.user.userId;

  const task = await Task.findById(id);
  if (!task) {
    throw new NotFoundError("Task not found");
  }

  if (task.userId.toString() !== userId) {
    throw new UnauthorizedError("Unauthorized access");
  }

  // Update task dengan cara manual
  task.title = title || task.title;
  task.description = description || task.description;
  task.dueDate = dueDate || task.dueDate;
  task.priority = priority || task.priority;
  task.status = status || task.status;

  await task.save();

  return task;
};

const deleteTask = async (req) => {
  if (!req.user || !req.user.userId) {
    throw new UnauthenticatedError("User is not authenticated.");
  }

  const { id } = req.params;

  const task = await Task.findById(id);
  const userId = req.user.userId;

  // Cek apakah task dimiliki oleh user yang login
  if (task.userId.toString() !== userId) {
    throw new UnauthorizedError("Unauthorized access");
  }

  await Task.findByIdAndDelete(id);

  // Hapus referensi task dari array tasks di user dengan cara update dengan method
  const result = await User.findByIdAndUpdate(
    userId,
    { $pull: { tasks: id } }, //$pull digunakan untuk menghapus elemen dari array dalam dokumen yang memenuhi kondisi tertentu.
    { new: true, runValidators: true }
  );
  delete result._doc.password;
  return result;
};

module.exports = {
  createTask,
  deleteTask,
  getAllTask,
  updateTask,
  getOneTask
};
