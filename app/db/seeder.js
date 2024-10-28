const User = require("../api/auth/model");
const Task = require("../api/task/model")
const db = require("../db");

const users = [
  {
    username: "adminUser",
    email: "admin@example.com",
    password: "password123",
    isVerified: true,
    tasks: [],
  },
  {
    username: "testUser1",
    email: "testuser1@example.com",
    password: "password123",
    isVerified: false,
    otpCode: "123456",
    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    tasks: [],
  },
  {
    username: "testUser2",
    email: "testuser2@example.com",
    password: "password123",
    isVerified: true,
    tasks: [],
  },
];

const tasks = [
  {
    title: "Finish report",
    description: "Complete the monthly report for management",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: "High",
    status: "In Progress",
  },
  {
    title: "Prepare presentation",
    description: "Prepare slides for the upcoming project pitch",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: "Medium",
    status: "Pending",
  },
  {
    title: "Code review",
    description: "Review pull requests for the new feature",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: "Low",
    status: "Pending",
  },
];

async function seedUsersAndTasks() {
  try {
    // Cek jumlah data dalam collection User
    const userCount = await User.countDocuments();

    // Jika ada lebih dari 1 dokumen, hentikan proses seeding
    if (userCount > 1) {
      console.log(
        "Data seeding skipped: Users already exist in the collection."
      );
      return;
    }
    // Jika tidak ada data, lakukan seeding
    const seededUsers = await User.insertMany(users);
    console.log("Data seeding completed for users");

    const userTasks = seededUsers.map((user, index) => {
      const userTask = tasks.map((task) => ({
        ...task,
        userId: user._id,
      }));
      return userTask;
    });

    const allTasks = userTasks.flat();
    await Task.insertMany(allTasks);
    console.log("Data seeding completed for tasks");
  } catch (error) {
    console.error("Error seeding users and tasks :", error);
  } finally {
    db.connection.close(); // Tutup koneksi setelah seeding
  }
}

seedUsersAndTasks();
