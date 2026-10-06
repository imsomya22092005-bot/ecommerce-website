const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
const {sendOrderStatusEmail} = require('../utils/emailService');


const createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;

        const shippingAddress = req.body.shippingAddress || req.body;
        const { fullName, address, city, state, pincode, phone } = shippingAddress;

        if (
            !fullName ||
            !address ||
            !city ||
            !state ||
            !pincode ||
            !phone
        ) {
            return res.status(400).json({
                message: 'Complete shipping address is required'
            });
        }

        const cart = await Cart.findOne({
            user: userId
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: 'Cart is empty'
            });
        }

        let totalAmount = 0;

        const orderItems = [];

        for (const cartItem of cart.items) {

            const product = await Product.findById(
                cartItem.product
            );

            if (!product) {
                return res.status(404).json({
                    message: 'One of the products no longer exists'
                });
            }

            if (product.stock < cartItem.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`
                });
            }

            totalAmount += product.price * cartItem.quantity;

            orderItems.push({
                product: product._id,
                quantity: cartItem.quantity,
                price: product.price
            });
        }

        const order = await Order.create({
            user: userId,

            items: orderItems,

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

            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        cart.items = [];

        await cart.save();

        await order.populate('items.product');

        const user = await User.findById(req.user.userId);

        sendOrderConfirmationEmail(user, order).catch(error => {
            console.error('Order confirmation email failed:', error.message);
        });

        res.status(201).json({
            message: 'Order placed successfully',
            order
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
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
            const product = await Product.findById(item.product);

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
                (total, variant) => total + variant.stock,
                0
            );

            await product.save();
        }

        order.status = 'cancelled';

        await order.save();

        const user = await User.findById(req.user.userId);

        if (user) {
            sendOrderStatusEmail(
                user,
                order,
                'cancelled'
            ).catch(error => {
                console.error(
                    'Cancellation email failed:',
                    error.message
                );
            });
        }

        await order.populate('items.product');

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order
        });

    } catch (error) {
        console.error('Cancel order error:', error);

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

        const order = await Order.findById(req.params.id);

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

        await order.populate('user', 'username email');
        await order.populate('items.product');

        res.status(200).json({
            message: 'Order status updated successfully',
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
            .populate('user', 'username email')
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error('Get all orders error:', error.message);
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