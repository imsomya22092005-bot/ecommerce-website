const express = require('express');

const {
    validateCoupon,
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon
} = require('../controllers/couponController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();


router.post('/validate',authMiddleware,validateCoupon);
router.post( '/', authMiddleware, adminMiddleware, createCoupon);
router.get( '/', authMiddleware, adminMiddleware, getCoupons);
router.put( '/:id', authMiddleware, adminMiddleware, updateCoupon);
router.delete( '/:id', authMiddleware, adminMiddleware, deleteCoupon);

module.exports = router;