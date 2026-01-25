const express = require("express");
const router = express.Router();
const controller = require("../controllers/freeze.controller");

router.post("/activate", controller.activate);

module.exports = router;
