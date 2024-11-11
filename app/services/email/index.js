const { email_user, password_user } = require("../../config");
const nodemailer = require("nodemailer");
const { logger } = require("../../utils/logger");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email_user,
    pass: password_user,
  },
});

const sendOtpEmail = (email, result) => {
  const mailOptions = {
    from: email_user,
    to: email,
    subject: "Verify your account",
    text: `Your OTP code is ${result.otpCode}. It is valid for 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const sendReminderEmail = async (email, subject, text) => {
  try {
    const mailOptions = {
      from: '"Task Reminder" <no-reply@organizeme.com>',
      to: email,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${email}`);
  } catch (error) {
    logger.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendOtpEmail,
  sendReminderEmail,
};
