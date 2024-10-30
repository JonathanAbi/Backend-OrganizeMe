const express = require("express");
const router = express();
const { index, destroy } = require("./controller");
const { authenticateUser } = require("../../middleware/auth");

router.get("/refresh-token/:refreshToken/:email",authenticateUser, index);
router.post("/logout",authenticateUser, destroy);

module.exports = router;
