const Wishlist = require('../models/wishlistModel');
const Product = require('../models/productModel');

// Get wishlist
const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({
            user: req.user.userId
        }).populate('products');

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user.userId,
                products: []
            });
        }

        res.status(200).json({
            success: true,
            wishlist
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get wishlist',
            error: error.message
        });
    }
};


// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
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

        let wishlist = await Wishlist.findOne({
            user: req.user.userId
        });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user.userId,
                products: [productId]
            });
        } else {
            const alreadyExists = wishlist.products.some(
                id => id.toString() === productId
            );

            if (alreadyExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Product is already in wishlist'
                });
            }

            wishlist.products.push(productId);
            await wishlist.save();
        }

        await wishlist.populate('products');

        res.status(200).json({
            success: true,
            message: 'Product added to wishlist',
            wishlist
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add product to wishlist',
            error: error.message
        });
    }
};


// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({
            user: req.user.userId
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        const originalLength = wishlist.products.length;

        wishlist.products = wishlist.products.filter(
            id => id.toString() !== productId
        );

        if (wishlist.products.length === originalLength) {
            return res.status(404).json({
                success: false,
                message: 'Product is not in wishlist'
            });
        }

        await wishlist.save();
        await wishlist.populate('products');

        res.status(200).json({
            success: true,
            message: 'Product removed from wishlist',
            wishlist
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to remove product from wishlist',
            error: error.message
        });
    }
};


// Clear wishlist
const clearWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({
            user: req.user.userId
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        wishlist.products = [];
        await wishlist.save();

        res.status(200).json({
            success: true,
            message: 'Wishlist cleared',
            wishlist
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to clear wishlist',
            error: error.message
        });
    }
};


module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
};