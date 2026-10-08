const Review = require('../models/reviewModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');


const updateProductRating = async (productId) => {
    const reviews = await Review.find({
        product: productId
    });

    const reviewCount = reviews.length;

    if (reviewCount === 0) {
        await Product.findByIdAndUpdate(productId, {
            rating: 0,
            reviewCount: 0
        });

        return;
    }

    const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
    );

    const averageRating = totalRating / reviewCount;

    await Product.findByIdAndUpdate(productId, {
        rating: Number(averageRating.toFixed(1)),
        reviewCount
    });
};


const createReview = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            productId,
            rating,
            comment
        } = req.body;

        if (!productId || rating === undefined || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Product, rating and comment are required'
            });
        }

        const numericRating = Number(rating);

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be a whole number between 1 and 5'
            });
        }

        if (comment.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Review must contain at least 3 characters'
            });
        }
        const product = await Product.findOne({
            _id: productId,
            isActive: true
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }


        const deliveredOrder = await Order.findOne({
            user: userId,
            status: 'delivered',
            'items.product': productId
        });

        if (!deliveredOrder) {
            return res.status(403).json({
                success: false,
                message: 'You can review this product only after purchasing and receiving it'
            });
        }

        const existingReview = await Review.findOne({
            product: productId,
            user: userId
        });

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        const review = await Review.create({
            product: productId,
            user: userId,
            rating: numericRating,
            comment: comment.trim(),
            verifiedPurchase: true
        });

        await updateProductRating(productId);

        await review.populate(
            'user',
            'username'
        );

        return res.status(201).json({
            success: true,
            message: 'Review added successfully',
            review
        });

    } catch (error) {
        console.error('Create review error:', error);

        // Handle MongoDB duplicate-key race condition
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to add review',
            error: error.message
        });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const page = Math.max(
            Number(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            50
        );

        const skip = (page - 1) * limit;
        const product = await Product.findOne({
            _id: productId,
            isActive: true
        }).select('name rating reviewCount');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const totalReviews = await Review.countDocuments({
            product: productId
        });

        const reviews = await Review.find({
            product: productId
        })
            .populate('user', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);


        const distribution = await Review.aggregate([
            {
                $match: {
                    product: product._id
                }
            },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]);

        const ratingDistribution = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        };

        distribution.forEach(item => {
            ratingDistribution[item._id] = item.count;
        });

        return res.status(200).json({
            success: true,

            product: {
                id: product._id,
                name: product.name,
                rating: product.rating,
                reviewCount: product.reviewCount
            },

            ratingDistribution,

            pagination: {
                page,
                limit,
                totalReviews,
                totalPages: Math.ceil(
                    totalReviews / limit
                )
            },

            reviews
        });

    } catch (error) {
        console.error('Get product reviews error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to get product reviews',
            error: error.message
        });
    }
};


const getMyReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;

        const review = await Review.findOne({
            product: productId,
            user: userId
        }).populate(
            'user',
            'username'
        );

        return res.status(200).json({
            success: true,
            review: review || null
        });

    } catch (error) {
        console.error('Get my review error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to get your review',
            error: error.message
        });
    }
};



const updateReview = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            rating,
            comment
        } = req.body;

        const review = await Review.findOne({
            _id: req.params.id,
            user: userId
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        if (rating !== undefined) {
            const numericRating = Number(rating);

            if (
                !Number.isInteger(numericRating) ||
                numericRating < 1 ||
                numericRating > 5
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be a whole number between 1 and 5'
                });
            }

            review.rating = numericRating;
        }

        if (comment !== undefined) {
            if (comment.trim().length < 3) {
                return res.status(400).json({
                    success: false,
                    message: 'Review must contain at least 3 characters'
                });
            }

            review.comment = comment.trim();
        }

        await review.save();

        // Recalculate product rating
        await updateProductRating(review.product);

        await review.populate(
            'user',
            'username'
        );

        return res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            review
        });

    } catch (error) {
        console.error('Update review error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to update review',
            error: error.message
        });
    }
};


const deleteReview = async (req, res) => {
    try {
        const userId = req.user.userId;

        const review = await Review.findOne({
            _id: req.params.id,
            user: userId
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        const productId = review.product;

        await review.deleteOne();

        await updateProductRating(productId);

        return res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });

    } catch (error) {
        console.error('Delete review error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to delete review',
            error: error.message
        });
    }
};


module.exports = {
    createReview,
    getProductReviews,
    getMyReview,
    updateReview,
    deleteReview
};