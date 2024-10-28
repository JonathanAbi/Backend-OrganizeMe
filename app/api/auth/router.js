const express = require("express");
const router = express();

const { signUp, verifyUser, resendOtpUser, signIn } = require("./controller");

router.post("/auth/signup", signUp);
router.put("/auth/verify-user", verifyUser);
router.post("/auth/resend-otp", resendOtpUser);
router.post("/auth/signin", signIn);

module.exports = router;
