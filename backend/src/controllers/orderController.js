const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
const { sendOrderStatusEmail } = require('../utils/emailService');
const Coupon = require('../models/couponModel');


const createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;

        const shippingAddress = req.body.shippingAddress || req.body;

        const couponCode = String(
            req.body.couponCode || ''
        )
            .trim()
            .toUpperCase();

        const {
            fullName,
            address,
            city,
            state,
            pincode,
            phone
        } = shippingAddress;

        if (
            !fullName ||
            !address ||
            !city ||
            !state ||
            !pincode ||
            !phone
        ) {
            return res.status(400).json({
                success: false,
                message: 'Complete shipping address is required'
            });
        }

        const cart = await Cart.findOne({
            user: userId
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const cartItem of cart.items) {

            const product = await Product.findOne({
                _id: cartItem.product,
                isActive: true
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'One of the products in your cart is no longer available. Please remove it and try again.'
                });
            }

            const variant = product.variants.find(
                item =>
                    item.size === cartItem.size &&
                    item.color === cartItem.color
            );

            if (!variant) {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} - selected size and color are no longer available`
                });
            }

            if (variant.stock < cartItem.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${variant.stock} item(s) available for ${product.name} (${cartItem.size}, ${cartItem.color})`
                });
            }

            const sellingPrice =
                product.discountPrice ?? product.price;

            totalAmount += sellingPrice * cartItem.quantity;

            orderItems.push({
                product: product._id,
                size: cartItem.size,
                color: cartItem.color,
                quantity: cartItem.quantity,
                price: sellingPrice
            });
        }

        const subtotalAmount = Number(
            totalAmount.toFixed(2)
        );

        let discountAmount = 0;
        let appliedCouponCode = null;
        let appliedCoupon = null;

        if (couponCode === 'WELCOME20') {
            const previousOrder = await Order.findOne({
                user: userId,
                status: {
                    $ne: 'cancelled'
                }
            });

            if (previousOrder) {
                return res.status(400).json({
                    success: false,
                    message: 'WELCOME20 is available only on your first purchase'
                });
            }

            const welcomeExpiry = new Date(
                '2026-12-31T23:59:59.999+05:30'
            );

            const now = new Date();

            if (now > welcomeExpiry) {
                return res.status(400).json({
                    success: false,
                    message: 'WELCOME20 has expired'
                });
            }

            if (subtotalAmount < 1000) {
                return res.status(400).json({
                    success: false,
                    message: 'Minimum order amount is ₹1000 for WELCOME20'
                });
            }

            discountAmount = subtotalAmount * 0.20;

            discountAmount = Math.min(
                discountAmount,
                500
            );

            discountAmount = Math.min(
                discountAmount,
                subtotalAmount
            );


            discountAmount = Number(
                discountAmount.toFixed(2)
            );


            appliedCouponCode = 'WELCOME20';
        }

        else if (couponCode) {

            const coupon = await Coupon.findOne({
                code: couponCode,
                isActive: true
            });

            if (!coupon) {
                return res.status(400).json({
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

            if (subtotalAmount < coupon.minOrderAmount) {
                return res.status(400).json({
                    success: false,
                    message: `Minimum order amount is ₹${coupon.minOrderAmount}`
                });
            }

            if (coupon.type === 'percentage') {
                discountAmount =
                    subtotalAmount * (coupon.value / 100);

                if (
                    coupon.maxDiscount !== null &&
                    discountAmount > coupon.maxDiscount
                ) {
                    discountAmount = coupon.maxDiscount;
                }

            } else {

                discountAmount = coupon.value;
            }

            discountAmount = Math.min(
                discountAmount,
                subtotalAmount
            );

            discountAmount = Number(
                discountAmount.toFixed(2)
            );


            appliedCoupon = coupon;
            appliedCouponCode = coupon.code;
        }

        totalAmount = Number(
            (subtotalAmount - discountAmount).toFixed(2)
        );

        const order = await Order.create({
            user: userId,

            items: orderItems,

            subtotalAmount,

            discountAmount,

            couponCode: appliedCouponCode,

            totalAmount,

            shippingAddress: {
                fullName,
                address,
                city,
                state,
                pincode,
                phone
            },

            status: 'confirmed'
        });

        for (const item of cart.items) {

            const product = await Product.findById(
                item.product
            );

            if (!product) {
                continue;
            }

            const variant = product.variants.find(
                variant =>
                    variant.size === item.size &&
                    variant.color === item.color
            );

            if (variant) {
                variant.stock -= item.quantity;
            }

            product.stock = product.variants.reduce(
                (total, variant) =>
                    total + variant.stock,
                0
            );

            await product.save();
        }

        cart.items = [];
        await cart.save();

        await order.populate('items.product');

        const user = await User.findById(userId);

        let emailSent = false;

        if (user) {
            emailSent = await sendOrderConfirmationEmail(
                user,
                order
            );
        }

        if (appliedCoupon) {
            await Coupon.findByIdAndUpdate(
                appliedCoupon._id,
                {
                    $inc: {usageCount: 1},
                    $push: { usedBy: userId}
                }
            );
        }

        res.status(201).json({
            success: true,

            message: emailSent
                ? 'Order placed successfully'
                : 'Order placed successfully, but the confirmation email could not be sent',

            emailSent,
            order
        });

    } catch (error) {

        console.error(
            'Create order error:',
            error
        );

        res.status(500).json({
            success: false,
            message: 'Failed to place order',
            error: error.message
        });
    }
};


const getMyOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            user: req.user.userId
        })
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.status(200).json({
            orders
        });

    } catch (error) {

        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


const getOrderById = async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.userId
        }).populate('items.product');

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        res.status(200).json(order);

    } catch (error) {

        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


const cancelOrder = async (req, res) => {
    try {

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Order is already cancelled'
            });
        }

        if (order.status === 'delivered') {
            return res.status(400).json({
                success: false,
                message: 'Delivered orders cannot be cancelled'
            });
        }

        for (const item of order.items) {

            const product = await Product.findById(
                item.product
            );

            if (!product) {
                continue;
            }

            const variant = product.variants.find(
                variant =>
                    variant.size === item.size &&
                    variant.color === item.color
            );

            if (variant) {
                variant.stock += item.quantity;
            }

            product.stock = product.variants.reduce(
                (total, variant) =>
                    total + variant.stock,
                0
            );

            await product.save();
        }

        order.status = 'cancelled';

        await order.save();

        const user = await User.findById(
            req.user.userId
        );

        let emailSent = false;

        if (user) {

            emailSent = await sendOrderStatusEmail(
                user,
                order,
                'cancelled'
            );
        }


        await order.populate('items.product');

        res.status(200).json({
            success: true,

            message: emailSent
                ? 'Order cancelled successfully'
                : 'Order cancelled successfully, but the cancellation email could not be sent',

            emailSent,

            order
        });

    } catch (error) {

        console.error(
            'Cancel order error:',
            error
        );

        res.status(500).json({
            success: false,
            message: 'Failed to cancel order',
            error: error.message
        });
    }
};


const updateOrderStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const allowedStatuses = [
            'pending',
            'confirmed',
            'shipped',
            'delivered',
            'cancelled'
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid order status'
            });
        }


        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }


        const order = await Order.findById(
            req.params.id
        );

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }


        if (order.status === 'cancelled') {
            return res.status(400).json({
                message: 'Cancelled order cannot be updated'
            });
        }


        order.status = status;

        await order.save();


        await order.populate(
            'user',
            'username email'
        );

        await order.populate(
            'items.product'
        );


        let emailSent = false;

        if (order.user) {

            emailSent = await sendOrderStatusEmail(
                order.user,
                order,
                status
            );
        }


        res.status(200).json({

            message: emailSent
                ? 'Order status updated successfully'
                : 'Order status updated successfully, but the status email could not be sent',

            emailSent,

            order
        });

    } catch (error) {

        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate(
                'user',
                'username email'
            )
            .populate(
                'items.product'
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {

        console.error(
            'Get all orders error:',
            error.message
        );

        res.status(500).json({
            success: false,
            message: 'Server error while fetching orders',
            error: error.message
        });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
};