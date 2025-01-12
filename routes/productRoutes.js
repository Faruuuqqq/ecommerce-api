const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken } = require('../middleware/middleware');

router.post('/', verifyToken, productController.addProduct);
router.get('/', verifyToken, productController.getProducts);
router.put('/:id', verifyToken, productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;