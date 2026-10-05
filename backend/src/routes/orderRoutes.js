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
const adminMiddleware = require('../middleware/adminMiddleware');

// Admin routes (declared before /:id)
router.get('/admin/all', authMiddleware, adminMiddleware, getAllOrders);
router.put('/admin/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.get('/all', authMiddleware, adminMiddleware, getAllOrders);

// User routes
router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getMyOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/cancel', authMiddleware, cancelOrder);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;