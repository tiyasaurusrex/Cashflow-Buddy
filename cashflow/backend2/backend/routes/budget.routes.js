const express = require("express");
const router = express.Router();
const controller = require("../controllers/budget.controller");

router.post("/init", controller.init);
router.get("/overview", controller.overview);
router.post("/freeze", controller.freeze);


module.exports = router;
