const express = require("express");
const router = express.Router();
const controller = require("../controllers/expense.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/add", verifyToken, controller.add);

module.exports = router;
