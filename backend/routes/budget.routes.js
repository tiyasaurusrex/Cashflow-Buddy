const express = require("express");
const router = express.Router();
const controller = require("../controllers/budget.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/init", verifyToken, controller.init);
router.get("/overview", verifyToken, controller.overview);
router.post("/reset", verifyToken, controller.resetMonth);
router.post("/update-allowance", verifyToken, controller.updateAllowance);
router.post("/month-start-date", verifyToken, controller.updateMonthStartDate);
module.exports = router;
