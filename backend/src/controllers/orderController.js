const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');


const createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            fullName,
            address,
            city,
            state,
            pincode,
            phone
        } = req.body;

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
                message: 'Order not found'
            });
        }

        if (
            order.status === 'shipped' ||
            order.status === 'delivered'
        ) {
            return res.status(400).json({
                message: 'This order cannot be cancelled'
            });
        }

        if (order.status === 'cancelled') {
            return res.status(400).json({
                message: 'Order is already cancelled'
            });
        }

        for (const item of order.items) {

            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: item.quantity
                    }
                }
            );
        }

        order.status = 'cancelled';

        await order.save();

        res.status(200).json({
            message: 'Order cancelled successfully',
            order
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
};