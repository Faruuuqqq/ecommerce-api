const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { verifyToken } = require('../middleware/middleware');

router.post('/', verifyToken, checkoutController.checkout);

module.exports = router;