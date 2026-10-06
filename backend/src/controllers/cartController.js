const Cart = require('../models/cartModel');
const Product = require('../models/productModel');


// GET CART


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

        res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cart',
            error: error.message
        });
    }
};


// ADD TO CART


const addToCart = async (req, res) => {
    try {
        const {
            productId,
            size,
            color,
            quantity = 1
        } = req.body;


        
        // Validate request

        if (!productId || !size || !color) {
            return res.status(400).json({
                success: false,
                message: 'Product ID, size and color are required'
            });
        }


        const requestedQuantity = Number(quantity);

        if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }


        
        // Find product

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


        // Find selected variant

        const variant = product.variants.find(
            item =>
                item.size === size &&
                item.color === color
        );


        if (!variant) {
            return res.status(400).json({
                success: false,
                message: 'Selected size and color combination is not available'
            });
        }


        
        // Check stock

        if (requestedQuantity > variant.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${variant.stock} item(s) available`
            });
        }


        
        // Find user's cart

        let cart = await Cart.findOne({
            user: req.user.userId
        });


        if (!cart) {
            cart = new Cart({
                user: req.user.userId,
                items: []
            });
        }

      
        // Find same variant in cart

        const existingItem = cart.items.find(
            item =>
                item.product.toString() === productId &&
                item.size === size &&
                item.color === color
        );


        if (existingItem) {

            const newQuantity =
                existingItem.quantity + requestedQuantity;


            if (newQuantity > variant.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${variant.stock} item(s) available`
                });
            }


            existingItem.quantity = newQuantity;

        } else {

            cart.items.push({
                product: productId,
                size,
                color,
                quantity: requestedQuantity
            });
        }


        await cart.save();

        await cart.populate('items.product');


        res.status(200).json({
            success: true,
            message: 'Product added to cart',
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Failed to add product to cart',
            error: error.message
        });
    }
};



// UPDATE CART ITEM

const updateCartItem = async (req, res) => {
    try {

        const {
            productId,
            size,
            color,
            quantity
        } = req.body;


        if (!productId || !size || !color || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Product ID, size, color and quantity are required'
            });
        }


        const requestedQuantity = Number(quantity);

        if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
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


        const variant = product.variants.find(
            item =>
                item.size === size &&
                item.color === color
        );


        if (!variant) {
            return res.status(400).json({
                success: false,
                message: 'Selected variant is not available'
            });
        }


        if (requestedQuantity > variant.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${variant.stock} item(s) available`
            });
        }


        const cart = await Cart.findOne({
            user: req.user.userId
        });


        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }


        const item = cart.items.find(
            item =>
                item.product.toString() === productId &&
                item.size === size &&
                item.color === color
        );


        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }


        item.quantity = requestedQuantity;

        await cart.save();

        await cart.populate('items.product');


        res.status(200).json({
            success: true,
            message: 'Cart updated',
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Failed to update cart',
            error: error.message
        });
    }
};



// REMOVE FROM CART

const removeFromCart = async (req, res) => {
    try {

        const {
            productId,
            size,
            color
        } = req.body;


        if (!productId || !size || !color) {
            return res.status(400).json({
                success: false,
                message: 'Product ID, size and color are required'
            });
        }


        const cart = await Cart.findOne({
            user: req.user.userId
        });


        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }


        const originalLength = cart.items.length;


        cart.items = cart.items.filter(
            item =>
                !(
                    item.product.toString() === productId &&
                    item.size === size &&
                    item.color === color
                )
        );


        if (cart.items.length === originalLength) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }


        await cart.save();

        await cart.populate('items.product');


        res.status(200).json({
            success: true,
            message: 'Product removed from cart',
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Failed to remove product',
            error: error.message
        });
    }
};



// CLEAR CART

const clearCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.user.userId
        });


        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }


        cart.items = [];

        await cart.save();


        res.status(200).json({
            success: true,
            message: 'Cart cleared',
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Failed to clear cart',
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