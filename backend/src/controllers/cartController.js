const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({
            user: req.user.userId
        }).populate('items.product');

        if (!cart) {
            cart = await Cart.create({
                user: req.user.userId,
                items: []
            });
        }

        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                message: 'Product ID and quantity are required'
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                message: 'Quantity must be at least 1'
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: 'Not enough stock available'
            });
        }

        let cart = await Cart.findOne({
            user: req.user.userId
        });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.userId,
                items: []
            });
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {

            const newQuantity = existingItem.quantity + Number(quantity);

            if (newQuantity > product.stock) {
                return res.status(400).json({
                    message: 'Not enough stock available'
                });
            }

            existingItem.quantity = newQuantity;

        } else {

            cart.items.push({
                product: productId,
                quantity: Number(quantity)
            });
        }

        await cart.save();

        await cart.populate('items.product');

        res.status(200).json({
            message: 'Product added to cart',
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                message: 'Product ID and quantity are required'
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                message: 'Quantity must be at least 1'
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: 'Not enough stock available'
            });
        }

        const cart = await Cart.findOne({
            user: req.user.userId
        });

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                message: 'Product is not in cart'
            });
        }

        item.quantity = Number(quantity);

        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({
            message: 'Cart updated',
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({
            user: req.user.userId
        });

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        const itemExists = cart.items.some(
            item => item.product.toString() === productId
        );

        if (!itemExists) {
            return res.status(404).json({
                message: 'Product is not in cart'
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({
            message: 'Product removed from cart',
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.userId
        });

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        cart.items = [];

        await cart.save();

        res.status(200).json({
            message: 'Cart cleared',
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};