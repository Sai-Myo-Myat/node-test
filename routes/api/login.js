const express = require('express');
const router = express.Router();
const userAuthController = require('../../controllers/loginController')


router.post('/', userAuthController.loginController)

module.exports = router;