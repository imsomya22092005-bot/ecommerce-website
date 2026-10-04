const express = require('express');

const router = express.Router();

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', getProducts);

router.get('/:id', getProductById);

router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    createProduct
);

router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    updateProduct
);

router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    deleteProduct
);

module.exports = router;