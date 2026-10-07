const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    brand: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    subcategory: {
        type: String,
        required: true,
        trim: true
    },

    gender: {
        type: String,
        enum: ['Men', 'Women', 'Unisex'],
        required: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    discountPrice: {
        type: Number,
        min: 0
    },

    // Kept for backward compatibility with the existing frontend
    image: {
        type: String,
        default: ''
    },

    // New fashion product images
    images: [{
        type: String
    }],

    // Available sizes
    sizes: [{
        type: String
    }],

    // Available colors
    colors: [{
        type: String
    }],

    // Size + color specific stock
    variants: [{
        size: {
            type: String,
            required: true
        },

        color: {
            type: String,
            required: true
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        }
    }],

    // Kept temporarily for old cart/order compatibility
    stock: {
        type: Number,
        min: 0,
        default: 0
    },

    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },

    reviewCount: {
        type: Number,
        min: 0,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;