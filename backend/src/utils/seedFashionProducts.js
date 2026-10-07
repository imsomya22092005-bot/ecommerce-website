const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/productModel');

const products = [
    {
        name: 'Classic Oversized Black T-Shirt',
        description: 'Premium cotton oversized t-shirt with a relaxed everyday fit.',
        brand: 'Urban Threads',
        category: 'Men',
        subcategory: 'T-Shirts',
        gender: 'Men',
        price: 1299,
        discountPrice: 899,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
            'https://images.unsplash.com/photo-1503341504253-dff4815485f1'
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White'],
        variants: [
            { size: 'S', color: 'Black', stock: 8 },
            { size: 'M', color: 'Black', stock: 12 },
            { size: 'L', color: 'Black', stock: 10 },
            { size: 'XL', color: 'Black', stock: 5 },
            { size: 'M', color: 'White', stock: 7 },
            { size: 'L', color: 'White', stock: 6 }
        ],
        stock: 48,
        rating: 4.6,
        reviewCount: 84
    },

    {
        name: 'Minimal White Shirt',
        description: 'Clean regular-fit shirt designed for casual and semi-formal looks.',
        brand: 'Mode Studio',
        category: 'Men',
        subcategory: 'Shirts',
        gender: 'Men',
        price: 1899,
        discountPrice: 1399,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf',
        images: [
            'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c'
        ],
        sizes: ['M', 'L', 'XL'],
        colors: ['White', 'Blue'],
        variants: [
            { size: 'M', color: 'White', stock: 8 },
            { size: 'L', color: 'White', stock: 10 },
            { size: 'XL', color: 'White', stock: 4 },
            { size: 'M', color: 'Blue', stock: 6 },
            { size: 'L', color: 'Blue', stock: 8 }
        ],
        stock: 36,
        rating: 4.4,
        reviewCount: 52
    },

    {
        name: 'Straight Fit Blue Jeans',
        description: 'Classic straight-fit denim with a comfortable everyday silhouette.',
        brand: 'Denim House',
        category: 'Men',
        subcategory: 'Jeans',
        gender: 'Men',
        price: 2499,
        discountPrice: 1799,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
        images: [
            'https://images.unsplash.com/photo-1542272604-787c3835535d'
        ],
        sizes: ['30', '32', '34', '36'],
        colors: ['Blue'],
        variants: [
            { size: '30', color: 'Blue', stock: 5 },
            { size: '32', color: 'Blue', stock: 9 },
            { size: '34', color: 'Blue', stock: 7 },
            { size: '36', color: 'Blue', stock: 4 }
        ],
        stock: 25,
        rating: 4.7,
        reviewCount: 116
    },

    {
        name: 'Women Floral Summer Dress',
        description: 'Lightweight floral dress perfect for summer days and casual outings.',
        brand: 'Bloom',
        category: 'Women',
        subcategory: 'Dresses',
        gender: 'Women',
        price: 2199,
        discountPrice: 1599,
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446',
        images: [
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446',
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c'
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Floral', 'Pink'],
        variants: [
            { size: 'S', color: 'Floral', stock: 5 },
            { size: 'M', color: 'Floral', stock: 8 },
            { size: 'L', color: 'Floral', stock: 6 },
            { size: 'XL', color: 'Floral', stock: 3 },
            { size: 'M', color: 'Pink', stock: 5 },
            { size: 'L', color: 'Pink', stock: 4 }
        ],
        stock: 31,
        rating: 4.8,
        reviewCount: 91
    },

    {
        name: 'Relaxed Fit Women Top',
        description: 'Soft everyday top with a relaxed fit and minimal design.',
        brand: 'Muse',
        category: 'Women',
        subcategory: 'Tops',
        gender: 'Women',
        price: 1499,
        discountPrice: 999,
        image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3',
        images: [
            'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3'
        ],
        sizes: ['S', 'M', 'L'],
        colors: ['Beige', 'Black'],
        variants: [
            { size: 'S', color: 'Beige', stock: 7 },
            { size: 'M', color: 'Beige', stock: 10 },
            { size: 'L', color: 'Beige', stock: 5 },
            { size: 'S', color: 'Black', stock: 6 },
            { size: 'M', color: 'Black', stock: 8 }
        ],
        stock: 36,
        rating: 4.5,
        reviewCount: 63
    },

    {
        name: 'Everyday White Sneakers',
        description: 'Minimal white sneakers designed for everyday comfort and styling.',
        brand: 'StepUp',
        category: 'Footwear',
        subcategory: 'Sneakers',
        gender: 'Unisex',
        price: 2999,
        discountPrice: 2299,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
        ],
        sizes: ['6', '7', '8', '9', '10'],
        colors: ['White'],
        variants: [
            { size: '6', color: 'White', stock: 5 },
            { size: '7', color: 'White', stock: 8 },
            { size: '8', color: 'White', stock: 10 },
            { size: '9', color: 'White', stock: 7 },
            { size: '10', color: 'White', stock: 4 }
        ],
        stock: 34,
        rating: 4.7,
        reviewCount: 143
    },

    {
        name: 'Classic Black Handbag',
        description: 'Structured everyday handbag with a clean and versatile design.',
        brand: 'Luna',
        category: 'Accessories',
        subcategory: 'Bags',
        gender: 'Women',
        price: 2799,
        discountPrice: 1999,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
        images: [
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3'
        ],
        sizes: ['One Size'],
        colors: ['Black', 'Brown'],
        variants: [
            { size: 'One Size', color: 'Black', stock: 9 },
            { size: 'One Size', color: 'Brown', stock: 6 }
        ],
        stock: 15,
        rating: 4.6,
        reviewCount: 47
    },

    {
        name: 'Oversized Grey Hoodie',
        description: 'Heavyweight fleece hoodie with an oversized streetwear-inspired fit.',
        brand: 'Street Lab',
        category: 'Men',
        subcategory: 'Hoodies',
        gender: 'Unisex',
        price: 2299,
        discountPrice: 1699,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
        images: [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7'
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Grey', 'Black'],
        variants: [
            { size: 'S', color: 'Grey', stock: 5 },
            { size: 'M', color: 'Grey', stock: 9 },
            { size: 'L', color: 'Grey', stock: 8 },
            { size: 'XL', color: 'Grey', stock: 3 },
            { size: 'M', color: 'Black', stock: 6 },
            { size: 'L', color: 'Black', stock: 5 }
        ],
        stock: 36,
        rating: 4.8,
        reviewCount: 102
    },

    {
        name: 'Minimal Gold Watch',
        description: 'Elegant minimal watch designed to complement both casual and formal outfits.',
        brand: 'Aurelia',
        category: 'Accessories',
        subcategory: 'Watches',
        gender: 'Unisex',
        price: 3499,
        discountPrice: 2499,
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d',
        images: [
            'https://images.unsplash.com/photo-1524805444758-089113d48a6d'
        ],
        sizes: ['One Size'],
        colors: ['Gold'],
        variants: [
            { size: 'One Size', color: 'Gold', stock: 12 }
        ],
        stock: 12,
        rating: 4.5,
        reviewCount: 38
    }
];

const seedFashionProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB connected');

        await Product.deleteMany({});

        await Product.insertMany(products);

        console.log(`${products.length} fashion products inserted successfully`);
    } catch (error) {
        console.error('Error seeding fashion products:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

seedFashionProducts();