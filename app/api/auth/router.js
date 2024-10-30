const express = require("express");
const router = express();

const { signUp, verifyUser, resendOtpUser, signIn } = require("./controller");
const { resendOtpRateLimiter, loginRateLimiter } = require("../../middleware/rateLimiting");

router.post("/auth/signup", signUp);
router.put("/auth/verify-user", verifyUser);
router.post("/auth/resend-otp", resendOtpRateLimiter, resendOtpUser);
router.post("/auth/signin",loginRateLimiter, signIn);

module.exports = router;
