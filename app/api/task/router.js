const express = require("express");
const router = express();
const { create, destroy, getAll, update, getOne } = require("./controller");
const { authenticateUser } = require("../../middleware/auth");

router.get("/tasks", authenticateUser, getAll);
router.get("/task/:id", authenticateUser, getOne);
router.post("/task", authenticateUser, create);
router.delete("/task/:id", authenticateUser, destroy);
router.put("/task/:id", authenticateUser, update);

module.exports = router;
