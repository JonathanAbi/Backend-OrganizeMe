const Task = require("../../api/task/model");
const User = require("../../api/auth/model");
const moment = require("moment");

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  UnauthenticatedError,
} = require("../../errors");

const getAllTasks = async (req) => {
  if (!req.user || !req.user.userId) {
    throw new UnauthenticatedError("User is not authenticated.");
  }

  const { keyword, startDate, endDate, priority, status } = req.query;
  let condition = { userId: req.user.userId };

  if (keyword) {
    condition = { ...condition, title: { $regex: keyword, $options: "i" } };
  }

  if (priority) {
    condition = { ...condition, priority: priority };
  }

  if (status) {
    condition = { ...condition, status: status };
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);
    condition = {
      ...condition,
      dueDate: {
        $gte: start,
        $lt: end,
      },
    };
  }

  const result = await Task.find(condition);
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

// Cari tugas yang dueDate-nya besok
const getTasksDueTomorrow = async () => {
  const tomorrow = moment().add(1, "day").startOf("day");
  const endOfTomorrow = moment().add(1, "day").endOf("day");

  return await Task.find({
    dueDate: { $gte: tomorrow.toDate(), $lte: endOfTomorrow.toDate() },
    reminderSent: false,
  }).populate({
    path: 'userId',
    select: 'email'
  }); 
};

// Tandai tugas sebagai sudah dikirimkan pengingat
const markTaskAsReminderSent = async (taskId) => {
  await Task.findByIdAndUpdate(taskId, { reminderSent: true });
};

module.exports = {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
  getOneTask,
  getTasksDueTomorrow,
  markTaskAsReminderSent
};
