const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');

router.post('/google', controller.googleLogin);

module.exports = router;
