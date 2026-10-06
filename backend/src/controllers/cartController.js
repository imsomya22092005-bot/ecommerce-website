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

        // Checkout may call this endpoint without product details.
        if (!productId) {
            const cart = await Cart.findOne({
                user: req.user.userId
            }).populate('items.product');

            if (!cart || cart.items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cart is empty'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Cart ready for checkout',
                cart
            });
        }

        const requestedQuantity = Number(quantity);

        if (
            !Number.isInteger(requestedQuantity) ||
            requestedQuantity < 1
        ) {
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

        const hasVariants =
            Array.isArray(product.variants) &&
            product.variants.length > 0;

        let selectedSize = String(size || "").trim();
        let selectedColor = String(color || "").trim();
        let availableStock = Number(product.stock) || 0;
        let variantKey = "";

        if (hasVariants) {
            const normalizedSize = String(selectedSize || "").trim().toLowerCase();
            const normalizedColor = String(selectedColor || "").trim().toLowerCase();

            let variant = product.variants.find(
                item =>
                    String(item.size || "").trim().toLowerCase() === normalizedSize &&
                    String(item.color || "").trim().toLowerCase() === normalizedColor
            );

            if (!variant && (!selectedSize || !selectedColor)) {
                variant =
                    product.variants.find(
                        item => Number(item.stock) > 0
                    ) || product.variants[0];
            }

            if (!variant) {
                return res.status(400).json({
                    success: false,
                    message: 'Selected size and color combination is not available'
                });
            }

            selectedSize = String(variant.size || "Default").trim();
            selectedColor = String(variant.color || "Default").trim();
            availableStock = Number(variant.stock) || 0;
            variantKey = selectedSize + "::" + selectedColor;
        } else {
            selectedSize = selectedSize || "Default";
            selectedColor = selectedColor || "Default";
            variantKey = "Default::Default";
        }

        if (requestedQuantity > availableStock) {
            return res.status(400).json({
                success: false,
                message: `Only ${availableStock} item(s) available`
            });
        }

        let cart = await Cart.findOne({
            user: req.user.userId
        });

        if (!cart) {
            cart = new Cart({
                user: req.user.userId,
                items: []
            });
        }

        const existingItem = cart.items.find(
            item =>
                item.product.toString() === productId &&
                item.size === selectedSize &&
                item.color === selectedColor
        );

        if (existingItem) {
            const newQuantity =
                existingItem.quantity + requestedQuantity;

            if (newQuantity > availableStock) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${availableStock} item(s) available`
                });
            }

            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({
                product: productId,
                size: selectedSize,
                color: selectedColor,
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


        if (!productId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and quantity are required'
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


        const hasVariants =
            Array.isArray(product.variants) &&
            product.variants.length > 0;

        const selectedSize = String(
            size || (hasVariants ? "" : "Default")
        ).trim();

        const selectedColor = String(
            color || (hasVariants ? "" : "Default")
        ).trim();

        let availableStock = Number(product.stock) || 0;

        if (hasVariants) {
            if (!selectedSize || !selectedColor) {
                return res.status(400).json({
                    success: false,
                    message: 'Size and color are required for this product'
                });
            }

            const variant = product.variants.find(
                item =>
                    item.size === selectedSize &&
                    item.color === selectedColor
            );

            if (!variant) {
                return res.status(400).json({
                    success: false,
                    message: 'Selected variant is not available'
                });
            }

            availableStock = Number(variant.stock) || 0;
        }

        if (requestedQuantity > availableStock) {
            return res.status(400).json({
                success: false,
                message: `Only ${availableStock} item(s) available`
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
                item.size === selectedSize &&
                item.color === selectedColor
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


        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
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
                    item.size === (size || "Default") &&
                    item.color === (color || "Default")
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