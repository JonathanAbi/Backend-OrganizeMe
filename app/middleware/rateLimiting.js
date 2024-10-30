const rateLimit = require("express-rate-limit");

const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // Jangka waktu 5 menit
  max: 3, // Maksimal 3 permintaan per IP dalam 5 menit
  message: "Too many login attempts, please try again later.",
  standardHeaders: true, // Menambahkan info limit di header response
  legacyHeaders: false, // Menonaktifkan x-rate-limit headers lama
});

const resendOtpRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1,
  message:
    "You can only resend OTP once per minute. Please wait before trying again.",
  keyGenerator: (req) => req.body.email, // Mengidentifikasi user berdasarkan email di body, defaultnya by IP
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginRateLimiter,
  resendOtpRateLimiter,
};
