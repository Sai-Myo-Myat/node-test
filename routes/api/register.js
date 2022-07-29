const express = require('express');
const router = express.Router();
const userAuthController = require('../../controllers/registerController')


router.post('/', userAuthController.registerController)

module.exports = router;