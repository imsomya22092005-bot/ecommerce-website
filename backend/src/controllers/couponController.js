const Coupon = require('../models/couponModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');


const calculateCartSubtotal = async (userId) => {
    const cart = await Cart.findOne({
        user: userId
    });

    if (!cart || cart.items.length === 0) {
        return {
            cart: null,
            subtotal: 0
        };
    }

    let subtotal = 0;

    for (const item of cart.items) {
        const product = await Product.findOne({
            _id: item.product,
            isActive: true
        });

        if (!product) {
            continue;
        }

        const price = product.discountPrice ?? product.price;

        subtotal += price * item.quantity;
    }

    return {
        cart,
        subtotal
    };
};



const calculateDiscount = (coupon, subtotal) => {
    let discount = 0;

    if (coupon.type === 'percentage') {
        discount = subtotal * (coupon.value / 100);

        if (
            coupon.maxDiscount !== null &&
            discount > coupon.maxDiscount
        ) {
            discount = coupon.maxDiscount;
        }
    } else {
        discount = coupon.value;
    }

    discount = Math.min(discount, subtotal);

    return Number(discount.toFixed(2));
};


const validateCoupon = async (req, res) => {
    try {
        const userId = req.user.userId;

        const code = String(req.body.code || '')
            .trim()
            .toUpperCase();

        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code is required'
            });
        }

        const coupon = await Coupon.findOne({
            code,
            isActive: true
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }

        const now = new Date();

        if (now < coupon.startDate) {
            return res.status(400).json({
                success: false,
                message: 'This coupon is not active yet'
            });
        }

        if (now > coupon.expiryDate) {
            return res.status(400).json({
                success: false,
                message: 'This coupon has expired'
            });
        }

        if (
            coupon.usageLimit !== null &&
            coupon.usageCount >= coupon.usageLimit
        ) {
            return res.status(400).json({
                success: false,
                message: 'This coupon has reached its usage limit'
            });
        }

        const userUsageCount = coupon.usedBy.filter(
            id => id.toString() === userId.toString()
        ).length;

        if (userUsageCount >= coupon.perUserLimit) {
            return res.status(400).json({
                success: false,
                message: 'You have already used this coupon'
            });
        }

        const { subtotal } =
            await calculateCartSubtotal(userId);

        if (subtotal <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Your cart is empty'
            });
        }

        if (subtotal < coupon.minOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount is ₹${coupon.minOrderAmount}`
            });
        }

        const discount = calculateDiscount(
            coupon,
            subtotal
        );

        const finalAmount = Number(
            (subtotal - discount).toFixed(2)
        );

        return res.status(200).json({
            success: true,
            message: 'Coupon applied successfully',

            coupon: {
                code: coupon.code,
                type: coupon.type,
                value: coupon.value
            },

            pricing: {
                subtotal,
                discount,
                finalAmount
            }
        });

    } catch (error) {
        console.error('Validate coupon error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to validate coupon',
            error: error.message
        });
    }
};


const createCoupon = async (req, res) => {
    try {
        let {
            code,
            type,
            value,
            minOrderAmount,
            maxDiscount,
            startDate,
            expiryDate,
            usageLimit,
            perUserLimit,
            isActive
        } = req.body;

        code = String(code || '')
            .trim()
            .toUpperCase();

        if (!code || !type || value === undefined || !expiryDate) {
            return res.status(400).json({
                success: false,
                message: 'Code, type, value and expiry date are required'
            });
        }

        if (!['percentage', 'fixed'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Coupon type must be percentage or fixed'
            });
        }

        value = Number(value);

        if (value <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Coupon value must be greater than 0'
            });
        }

        if (type === 'percentage' && value > 100) {
            return res.status(400).json({
                success: false,
                message: 'Percentage discount cannot exceed 100'
            });
        }

        const coupon = await Coupon.create({
            code,
            type,
            value,
            minOrderAmount: Number(minOrderAmount) || 0,
            maxDiscount:
                maxDiscount !== undefined &&
                maxDiscount !== null &&
                maxDiscount !== ''
                    ? Number(maxDiscount)
                    : null,
            startDate: startDate || new Date(),
            expiryDate,
            usageLimit:
                usageLimit !== undefined &&
                usageLimit !== null &&
                usageLimit !== ''
                    ? Number(usageLimit)
                    : null,
            perUserLimit:
                Number(perUserLimit) || 1,
            isActive:
                isActive !== undefined
                    ? Boolean(isActive)
                    : true
        });

        return res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            coupon
        });

    } catch (error) {
        console.error('Create coupon error:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Coupon code already exists'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to create coupon',
            error: error.message
        });
    }
};

const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            coupons
        });

    } catch (error) {
        console.error('Get coupons error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to get coupons',
            error: error.message
        });
    }
};

const updateCoupon = async (req, res) => {
    try {
        const updates = {
            ...req.body
        };

        if (updates.code) {
            updates.code = String(updates.code)
                .trim()
                .toUpperCase();
        }

        if (updates.value !== undefined) {
            updates.value = Number(updates.value);
        }

        if (updates.minOrderAmount !== undefined) {
            updates.minOrderAmount =
                Number(updates.minOrderAmount);
        }

        if (updates.maxDiscount !== undefined) {
            updates.maxDiscount =
                updates.maxDiscount === null ||
                updates.maxDiscount === ''
                    ? null
                    : Number(updates.maxDiscount);
        }

        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Coupon updated successfully',
            coupon
        });

    } catch (error) {
        console.error('Update coupon error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to update coupon',
            error: error.message
        });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(
            req.params.id
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Coupon deleted successfully'
        });

    } catch (error) {
        console.error('Delete coupon error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to delete coupon',
            error: error.message
        });
    }
};


module.exports = {
    validateCoupon,
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon
};