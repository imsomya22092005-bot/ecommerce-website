const express = require('express');

const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createOrder);

router.get('/all', authMiddleware, getAllOrders);
router.get('/', authMiddleware, getMyOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/cancel', authMiddleware, cancelOrder);

router.put('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;