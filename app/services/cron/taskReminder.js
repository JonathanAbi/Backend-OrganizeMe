const cron = require("node-cron");

const {
  getTasksDueTomorrow,
  markTaskAsReminderSent,
} = require("../../services/mongoose/tasks");
const { sendReminderEmail } = require("../../services/email");
const { logger } = require("../../utils/logger");

// Cron job untuk memeriksa tugas setiap hari pada jam 08:00
cron.schedule("*/5 * * * *", async () => {
  logger.info("Starting task reminder job...");

  try {
    const tasks = await getTasksDueTomorrow();
    logger.info(`Found ${tasks.length} tasks due tomorrow.`);

    tasks.forEach(async (task) => {
      logger.info(
        `Preparing to send email to: ${task.userId.email} for task: ${task.title}`
      );

      const emailSubject = `Reminder: Task "${task.title}" is due soon!`;
      const emailText = `Hello, your task "${task.title}" is due on ${task.dueDate}. Please make sure to complete it on time.`;

      await sendReminderEmail(task.userId.email, emailSubject, emailText);
      await markTaskAsReminderSent(task._id);
    });

    logger.info("Task reminder job completed successfully.");
  } catch (error) {
    logger.error("Error in task reminder job:", error);
  }
});
