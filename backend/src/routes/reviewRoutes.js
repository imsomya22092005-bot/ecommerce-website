const express = require('express');

const {
    createReview,
    getProductReviews,
    getMyReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/product/:productId',getProductReviews);
router.get('/product/:productId/my-review',authMiddleware,getMyReview);
router.post('/',authMiddleware,createReview);
router.put('/:id',authMiddleware,updateReview);
router.delete('/:id',authMiddleware,deleteReview);


module.exports = router;