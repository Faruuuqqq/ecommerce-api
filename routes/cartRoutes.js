const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyTOken } = require('../middleware/middleware');

router.post('/', verifyToken, cartController.addToCart);
router.delete('/:id', verifyToken, cartController.removeFromCart);
router.get('/:userId', verifyToken, cartController.viewCart);
router.put('/:id', verifyToken, cartController.updateCart);

module.exports = router;