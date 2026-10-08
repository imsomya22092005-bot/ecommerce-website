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
    },

    {
        name: "Premium White Oversized T-Shirt",
        description: "Premium heavyweight oversized white t-shirt with a relaxed modern fit.",
        brand: "Urban Thread",
        category: "Clothing",
        subcategory: "T-Shirts",
        gender: "Unisex",
        price: 999,
        discountPrice: 749,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Black"],
        variants: [
            { size: "S", color: "White", stock: 12 },
            { size: "M", color: "White", stock: 15 },
            { size: "L", color: "White", stock: 12 },
            { size: "XL", color: "White", stock: 8 },
            { size: "M", color: "Black", stock: 10 }
        ],
        stock: 57,
        rating: 4.6,
        reviewCount: 84,
        isActive: true
    },

    {
        name: "Classic Blue Denim Jacket",
        description: "Classic denim jacket designed for everyday casual styling.",
        brand: "Denim Works",
        category: "Clothing",
        subcategory: "Jackets",
        gender: "Men",
        price: 2499,
        discountPrice: 1899,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
        images: [
            "https://images.unsplash.com/photo-1551028719-00167b16eac5"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue"],
        variants: [
            { size: "S", color: "Blue", stock: 8 },
            { size: "M", color: "Blue", stock: 14 },
            { size: "L", color: "Blue", stock: 12 },
            { size: "XL", color: "Blue", stock: 7 }
        ],
        stock: 41,
        rating: 4.5,
        reviewCount: 61,
        isActive: true
    },

    {
        name: "Women's Ribbed Crop Top",
        description: "Soft ribbed crop top with a comfortable stretch fit.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Tops",
        gender: "Women",
        price: 899,
        discountPrice: 649,
        image: "https://images.unsplash.com/photo-1566206091558-7f218b696731",
        images: [
            "https://images.unsplash.com/photo-1566206091558-7f218b696731"
        ],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black", "White"],
        variants: [
            { size: "XS", color: "Black", stock: 8 },
            { size: "S", color: "Black", stock: 14 },
            { size: "M", color: "Black", stock: 15 },
            { size: "L", color: "Black", stock: 9 },
            { size: "S", color: "White", stock: 10 },
            { size: "M", color: "White", stock: 12 }
        ],
        stock: 68,
        rating: 4.4,
        reviewCount: 73,
        isActive: true
    },

    {
        name: "Slim Fit Black Jeans",
        description: "Stretchable slim-fit black jeans suitable for everyday wear.",
        brand: "Denim Works",
        category: "Clothing",
        subcategory: "Jeans",
        gender: "Men",
        price: 1999,
        discountPrice: 1499,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
        images: [
            "https://images.unsplash.com/photo-1542272604-787c3835535d"
        ],
        sizes: ["30", "32", "34", "36"],
        colors: ["Black"],
        variants: [
            { size: "30", color: "Black", stock: 9 },
            { size: "32", color: "Black", stock: 14 },
            { size: "34", color: "Black", stock: 13 },
            { size: "36", color: "Black", stock: 8 }
        ],
        stock: 44,
        rating: 4.3,
        reviewCount: 96,
        isActive: true
    },

    {
        name: "Women's High Waist Blue Jeans",
        description: "High-waisted straight-fit denim with a comfortable everyday silhouette.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Jeans",
        gender: "Women",
        price: 2199,
        discountPrice: 1699,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
        images: [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246"
        ],
        sizes: ["26", "28", "30", "32"],
        colors: ["Blue"],
        variants: [
            { size: "26", color: "Blue", stock: 7 },
            { size: "28", color: "Blue", stock: 13 },
            { size: "30", color: "Blue", stock: 12 },
            { size: "32", color: "Blue", stock: 8 }
        ],
        stock: 40,
        rating: 4.7,
        reviewCount: 112,
        isActive: true
    },

    {
        name: "Oversized Graphic Hoodie",
        description: "Warm oversized hoodie featuring a minimal graphic design.",
        brand: "Urban Thread",
        category: "Clothing",
        subcategory: "Hoodies",
        gender: "Unisex",
        price: 1799,
        discountPrice: 1299,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
        images: [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Grey", "Black"],
        variants: [
            { size: "S", color: "Grey", stock: 9 },
            { size: "M", color: "Grey", stock: 15 },
            { size: "L", color: "Grey", stock: 13 },
            { size: "XL", color: "Grey", stock: 8 },
            { size: "M", color: "Black", stock: 12 }
        ],
        stock: 57,
        rating: 4.8,
        reviewCount: 143,
        isActive: true
    },

    {
        name: "Women's Floral Summer Dress",
        description: "Lightweight floral dress designed for comfortable summer styling.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Dresses",
        gender: "Women",
        price: 1899,
        discountPrice: 1399,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
        images: [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8"
        ],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Pink", "White"],
        variants: [
            { size: "XS", color: "Pink", stock: 7 },
            { size: "S", color: "Pink", stock: 12 },
            { size: "M", color: "Pink", stock: 14 },
            { size: "L", color: "Pink", stock: 8 },
            { size: "M", color: "White", stock: 9 }
        ],
        stock: 50,
        rating: 4.6,
        reviewCount: 88,
        isActive: true
    },

    {
        name: "Classic Cotton Polo Shirt",
        description: "Classic cotton polo shirt with a clean and versatile design.",
        brand: "Urban Thread",
        category: "Clothing",
        subcategory: "Polo Shirts",
        gender: "Men",
        price: 1299,
        discountPrice: 949,
        image: "https://images.unsplash.com/photo-1625910513413-5fc45b7d0f8a",
        images: [
            "https://images.unsplash.com/photo-1625910513413-5fc45b7d0f8a"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Navy", "White"],
        variants: [
            { size: "S", color: "Navy", stock: 10 },
            { size: "M", color: "Navy", stock: 16 },
            { size: "L", color: "Navy", stock: 13 },
            { size: "XL", color: "Navy", stock: 7 },
            { size: "M", color: "White", stock: 11 }
        ],
        stock: 57,
        rating: 4.4,
        reviewCount: 67,
        isActive: true
    },

    {
        name: "Relaxed Fit Cargo Pants",
        description: "Relaxed cargo pants with multiple utility pockets.",
        brand: "Street Mode",
        category: "Clothing",
        subcategory: "Cargo Pants",
        gender: "Unisex",
        price: 1799,
        discountPrice: 1349,
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
        images: [
            "https://images.unsplash.com/photo-1517841905240-472988babdf9"
        ],
        sizes: ["28", "30", "32", "34", "36"],
        colors: ["Olive", "Black"],
        variants: [
            { size: "28", color: "Olive", stock: 7 },
            { size: "30", color: "Olive", stock: 12 },
            { size: "32", color: "Olive", stock: 15 },
            { size: "34", color: "Olive", stock: 11 },
            { size: "36", color: "Olive", stock: 6 },
            { size: "32", color: "Black", stock: 10 }
        ],
        stock: 61,
        rating: 4.5,
        reviewCount: 91,
        isActive: true
    },

    {
        name: "Minimalist Beige Sweater",
        description: "Soft beige sweater with a minimalist premium look.",
        brand: "Urban Thread",
        category: "Clothing",
        subcategory: "Sweaters",
        gender: "Unisex",
        price: 1599,
        discountPrice: 1199,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
        images: [
            "https://images.unsplash.com/photo-1434389677669-e08b4cac3105"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Beige"],
        variants: [
            { size: "S", color: "Beige", stock: 8 },
            { size: "M", color: "Beige", stock: 15 },
            { size: "L", color: "Beige", stock: 13 },
            { size: "XL", color: "Beige", stock: 7 }
        ],
        stock: 43,
        rating: 4.7,
        reviewCount: 78,
        isActive: true
    },

    {
        name: "Women's Casual Blazer",
        description: "Structured casual blazer suitable for office and smart-casual outfits.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Blazers",
        gender: "Women",
        price: 2999,
        discountPrice: 2299,
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
        images: [
            "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3"
        ],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black", "Beige"],
        variants: [
            { size: "XS", color: "Black", stock: 6 },
            { size: "S", color: "Black", stock: 10 },
            { size: "M", color: "Black", stock: 12 },
            { size: "L", color: "Black", stock: 7 },
            { size: "M", color: "Beige", stock: 8 }
        ],
        stock: 43,
        rating: 4.6,
        reviewCount: 54,
        isActive: true
    },

    {
        name: "Men's Linen Casual Shirt",
        description: "Breathable linen-blend shirt designed for relaxed summer outfits.",
        brand: "Street Mode",
        category: "Clothing",
        subcategory: "Shirts",
        gender: "Men",
        price: 1499,
        discountPrice: 1099,
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
        images: [
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Beige"],
        variants: [
            { size: "S", color: "White", stock: 8 },
            { size: "M", color: "White", stock: 14 },
            { size: "L", color: "White", stock: 13 },
            { size: "XL", color: "White", stock: 7 },
            { size: "M", color: "Beige", stock: 9 }
        ],
        stock: 51,
        rating: 4.5,
        reviewCount: 72,
        isActive: true
    },

    {
        name: "Women's Pleated Midi Skirt",
        description: "Elegant pleated midi skirt with a comfortable flowing silhouette.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Skirts",
        gender: "Women",
        price: 1399,
        discountPrice: 999,
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27",
        images: [
            "https://images.unsplash.com/photo-1583496661160-fb5886a13d27"
        ],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black", "Beige"],
        variants: [
            { size: "XS", color: "Black", stock: 7 },
            { size: "S", color: "Black", stock: 13 },
            { size: "M", color: "Black", stock: 14 },
            { size: "L", color: "Black", stock: 8 },
            { size: "M", color: "Beige", stock: 10 }
        ],
        stock: 52,
        rating: 4.4,
        reviewCount: 63,
        isActive: true
    },

    {
        name: "Classic Running Sneakers",
        description: "Lightweight running sneakers with cushioned soles for everyday movement.",
        brand: "MoveX",
        category: "Footwear",
        subcategory: "Sneakers",
        gender: "Unisex",
        price: 2499,
        discountPrice: 1899,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
        ],
        sizes: ["6", "7", "8", "9", "10"],
        colors: ["White", "Red"],
        variants: [
            { size: "6", color: "White", stock: 7 },
            { size: "7", color: "White", stock: 12 },
            { size: "8", color: "White", stock: 15 },
            { size: "9", color: "White", stock: 13 },
            { size: "10", color: "White", stock: 8 },
            { size: "9", color: "Red", stock: 6 }
        ],
        stock: 61,
        rating: 4.8,
        reviewCount: 176,
        isActive: true
    },

    {
        name: "Minimal Leather Crossbody Bag",
        description: "Compact crossbody bag with a clean minimalist design.",
        brand: "Luna Accessories",
        category: "Accessories",
        subcategory: "Bags",
        gender: "Women",
        price: 1799,
        discountPrice: 1299,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
        images: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3"
        ],
        sizes: ["One Size"],
        colors: ["Black", "Brown"],
        variants: [
            { size: "One Size", color: "Black", stock: 14 },
            { size: "One Size", color: "Brown", stock: 11 }
        ],
        stock: 25,
        rating: 4.5,
        reviewCount: 58,
        isActive: true
    },

    {
        name: "Classic Baseball Cap",
        description: "Adjustable cotton baseball cap for casual everyday styling.",
        brand: "Street Mode",
        category: "Accessories",
        subcategory: "Caps",
        gender: "Unisex",
        price: 699,
        discountPrice: 499,
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee",
        images: [
            "https://images.unsplash.com/photo-1521369909029-2afed882baee"
        ],
        sizes: ["One Size"],
        colors: ["Black", "White", "Navy"],
        variants: [
            { size: "One Size", color: "Black", stock: 20 },
            { size: "One Size", color: "White", stock: 15 },
            { size: "One Size", color: "Navy", stock: 12 }
        ],
        stock: 47,
        rating: 4.3,
        reviewCount: 42,
        isActive: true
    },

    {
        name: "Premium Cotton Sweatpants",
        description: "Comfortable cotton sweatpants with a relaxed everyday fit.",
        brand: "Urban Thread",
        category: "Clothing",
        subcategory: "Sweatpants",
        gender: "Unisex",
        price: 1399,
        discountPrice: 999,
        image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea",
        images: [
            "https://images.unsplash.com/photo-1552902865-b72c031ac5ea"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Grey", "Black"],
        variants: [
            { size: "S", color: "Grey", stock: 10 },
            { size: "M", color: "Grey", stock: 15 },
            { size: "L", color: "Grey", stock: 13 },
            { size: "XL", color: "Grey", stock: 7 },
            { size: "M", color: "Black", stock: 11 }
        ],
        stock: 56,
        rating: 4.6,
        reviewCount: 105,
        isActive: true
    },

    {
        name: "Women's Knit Cardigan",
        description: "Soft knit cardigan perfect for layering during cooler weather.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Cardigans",
        gender: "Women",
        price: 1699,
        discountPrice: 1249,
        image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6",
        images: [
            "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Cream", "Brown"],
        variants: [
            { size: "S", color: "Cream", stock: 8 },
            { size: "M", color: "Cream", stock: 14 },
            { size: "L", color: "Cream", stock: 12 },
            { size: "XL", color: "Cream", stock: 7 },
            { size: "M", color: "Brown", stock: 9 }
        ],
        stock: 50,
        rating: 4.7,
        reviewCount: 69,
        isActive: true
    },

    {
        name: "Men's Formal Oxford Shirt",
        description: "Crisp cotton oxford shirt designed for formal and business-casual outfits.",
        brand: "Executive Wear",
        category: "Clothing",
        subcategory: "Formal Shirts",
        gender: "Men",
        price: 1599,
        discountPrice: 1199,
        image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab",
        images: [
            "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Blue"],
        variants: [
            { size: "S", color: "White", stock: 8 },
            { size: "M", color: "White", stock: 14 },
            { size: "L", color: "White", stock: 15 },
            { size: "XL", color: "White", stock: 10 },
            { size: "XXL", color: "White", stock: 5 },
            { size: "M", color: "Blue", stock: 10 }
        ],
        stock: 62,
        rating: 4.6,
        reviewCount: 81,
        isActive: true
    },

    {
        name: "Canvas Everyday Backpack",
        description: "Durable canvas backpack with multiple compartments for daily use.",
        brand: "Street Mode",
        category: "Accessories",
        subcategory: "Backpacks",
        gender: "Unisex",
        price: 1599,
        discountPrice: 1149,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"
        ],
        sizes: ["One Size"],
        colors: ["Black", "Green"],
        variants: [
            { size: "One Size", color: "Black", stock: 18 },
            { size: "One Size", color: "Green", stock: 13 }
        ],
        stock: 31,
        rating: 4.5,
        reviewCount: 74,
        isActive: true
    },
    {
        name: "Essential Black Hoodie",
        description: "Comfortable everyday black hoodie with a relaxed fit.",
        brand: "Urban Thread",
        category: "Clothing",
        subcategory: "Hoodies",
        gender: "Unisex",
        price: 1799,
        discountPrice: 1299,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
        images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Grey"],
        variants: [
            { size: "S", color: "Black", stock: 10 },
            { size: "M", color: "Black", stock: 15 },
            { size: "L", color: "Black", stock: 12 },
            { size: "XL", color: "Black", stock: 8 }
        ],
        stock: 45,
        rating: 4.6,
        reviewCount: 91,
        isActive: true
    },

    {
        name: "Sky Blue Casual Shirt",
        description: "Lightweight casual shirt for everyday summer outfits.",
        brand: "Street Mode",
        category: "Clothing",
        subcategory: "Shirts",
        gender: "Men",
        price: 1399,
        discountPrice: 999,
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
        images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue"],
        variants: [
            { size: "S", color: "Blue", stock: 8 },
            { size: "M", color: "Blue", stock: 14 },
            { size: "L", color: "Blue", stock: 12 },
            { size: "XL", color: "Blue", stock: 7 }
        ],
        stock: 41,
        rating: 4.4,
        reviewCount: 64,
        isActive: true
    },

    {
        name: "Classic Grey Sweatshirt",
        description: "Soft cotton sweatshirt with a simple classic design.",
        brand: "Urban Thread",
        category: "Clothing",
        subcategory: "Sweatshirts",
        gender: "Unisex",
        price: 1499,
        discountPrice: 1099,
        image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2",
        images: ["https://images.unsplash.com/photo-1578587018452-892bacefd3f2"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Grey"],
        variants: [
            { size: "S", color: "Grey", stock: 9 },
            { size: "M", color: "Grey", stock: 15 },
            { size: "L", color: "Grey", stock: 13 },
            { size: "XL", color: "Grey", stock: 8 }
        ],
        stock: 45,
        rating: 4.5,
        reviewCount: 78,
        isActive: true
    },

    {
        name: "Relaxed White Linen Shirt",
        description: "Breathable linen shirt with a relaxed comfortable fit.",
        brand: "Executive Wear",
        category: "Clothing",
        subcategory: "Shirts",
        gender: "Men",
        price: 1699,
        discountPrice: 1249,
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157",
        images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["White"],
        variants: [
            { size: "S", color: "White", stock: 7 },
            { size: "M", color: "White", stock: 13 },
            { size: "L", color: "White", stock: 14 },
            { size: "XL", color: "White", stock: 8 }
        ],
        stock: 42,
        rating: 4.7,
        reviewCount: 82,
        isActive: true
    },

    {
        name: "Women's Black Casual Top",
        description: "Minimal black top with a comfortable modern silhouette.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Tops",
        gender: "Women",
        price: 999,
        discountPrice: 699,
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
        images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3"],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black"],
        variants: [
            { size: "XS", color: "Black", stock: 8 },
            { size: "S", color: "Black", stock: 14 },
            { size: "M", color: "Black", stock: 15 },
            { size: "L", color: "Black", stock: 9 }
        ],
        stock: 46,
        rating: 4.5,
        reviewCount: 76,
        isActive: true
    },

    {
        name: "Women's Beige Knit Top",
        description: "Soft knit top designed for comfortable everyday styling.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Tops",
        gender: "Women",
        price: 1199,
        discountPrice: 849,
        image: "https://images.unsplash.com/photo-1627225924765-552d49cf47ad",
        images: ["https://images.unsplash.com/photo-1627225924765-552d49cf47ad"],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Beige"],
        variants: [
            { size: "XS", color: "Beige", stock: 7 },
            { size: "S", color: "Beige", stock: 13 },
            { size: "M", color: "Beige", stock: 14 },
            { size: "L", color: "Beige", stock: 8 }
        ],
        stock: 42,
        rating: 4.6,
        reviewCount: 61,
        isActive: true
    },

    {
        name: "Straight Fit Blue Jeans",
        description: "Classic straight-fit blue denim for everyday wear.",
        brand: "Denim Works",
        category: "Clothing",
        subcategory: "Jeans",
        gender: "Men",
        price: 2199,
        discountPrice: 1599,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
        images: ["https://images.unsplash.com/photo-1542272604-787c3835535d"],
        sizes: ["30", "32", "34", "36"],
        colors: ["Blue"],
        variants: [
            { size: "30", color: "Blue", stock: 8 },
            { size: "32", color: "Blue", stock: 14 },
            { size: "34", color: "Blue", stock: 13 },
            { size: "36", color: "Blue", stock: 8 }
        ],
        stock: 43,
        rating: 4.5,
        reviewCount: 104,
        isActive: true
    },

    {
        name: "Women's Wide Leg Trousers",
        description: "Elegant wide-leg trousers with a relaxed modern fit.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Trousers",
        gender: "Women",
        price: 1799,
        discountPrice: 1299,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1",
        images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1"],
        sizes: ["26", "28", "30", "32"],
        colors: ["Black", "Beige"],
        variants: [
            { size: "26", color: "Black", stock: 7 },
            { size: "28", color: "Black", stock: 12 },
            { size: "30", color: "Black", stock: 14 },
            { size: "32", color: "Black", stock: 8 }
        ],
        stock: 41,
        rating: 4.6,
        reviewCount: 72,
        isActive: true
    },

    {
        name: "Olive Cargo Trousers",
        description: "Utility-inspired cargo trousers with multiple pockets.",
        brand: "Street Mode",
        category: "Clothing",
        subcategory: "Cargo Pants",
        gender: "Men",
        price: 1899,
        discountPrice: 1399,
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
        images: ["https://images.unsplash.com/photo-1517841905240-472988babdf9"],
        sizes: ["30", "32", "34", "36"],
        colors: ["Olive"],
        variants: [
            { size: "30", color: "Olive", stock: 8 },
            { size: "32", color: "Olive", stock: 14 },
            { size: "34", color: "Olive", stock: 12 },
            { size: "36", color: "Olive", stock: 7 }
        ],
        stock: 41,
        rating: 4.4,
        reviewCount: 67,
        isActive: true
    },

    {
        name: "Minimal White Sneakers",
        description: "Clean white sneakers designed for everyday casual outfits.",
        brand: "MoveX",
        category: "Footwear",
        subcategory: "Sneakers",
        gender: "Unisex",
        price: 2299,
        discountPrice: 1699,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772"],
        sizes: ["6", "7", "8", "9", "10"],
        colors: ["White"],
        variants: [
            { size: "6", color: "White", stock: 7 },
            { size: "7", color: "White", stock: 12 },
            { size: "8", color: "White", stock: 15 },
            { size: "9", color: "White", stock: 13 },
            { size: "10", color: "White", stock: 8 }
        ],
        stock: 55,
        rating: 4.8,
        reviewCount: 183,
        isActive: true
    },

    {
        name: "Black High Top Sneakers",
        description: "Classic high-top sneakers with a bold casual appearance.",
        brand: "MoveX",
        category: "Footwear",
        subcategory: "Sneakers",
        gender: "Unisex",
        price: 2499,
        discountPrice: 1899,
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
        images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77"],
        sizes: ["6", "7", "8", "9", "10"],
        colors: ["Black"],
        variants: [
            { size: "6", color: "Black", stock: 6 },
            { size: "7", color: "Black", stock: 11 },
            { size: "8", color: "Black", stock: 14 },
            { size: "9", color: "Black", stock: 12 },
            { size: "10", color: "Black", stock: 7 }
        ],
        stock: 50,
        rating: 4.7,
        reviewCount: 129,
        isActive: true
    },

    {
        name: "Classic Brown Loafers",
        description: "Smart casual loafers suitable for formal and everyday outfits.",
        brand: "Executive Wear",
        category: "Footwear",
        subcategory: "Loafers",
        gender: "Men",
        price: 2799,
        discountPrice: 2099,
        image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509",
        images: ["https://images.unsplash.com/photo-1533867617858-e7b97e060509"],
        sizes: ["7", "8", "9", "10", "11"],
        colors: ["Brown"],
        variants: [
            { size: "7", color: "Brown", stock: 6 },
            { size: "8", color: "Brown", stock: 11 },
            { size: "9", color: "Brown", stock: 13 },
            { size: "10", color: "Brown", stock: 10 },
            { size: "11", color: "Brown", stock: 6 }
        ],
        stock: 46,
        rating: 4.6,
        reviewCount: 71,
        isActive: true
    },

    {
        name: "Women's Everyday Flats",
        description: "Comfortable flats designed for everyday walking and casual outfits.",
        brand: "Luna Accessories",
        category: "Footwear",
        subcategory: "Flats",
        gender: "Women",
        price: 1399,
        discountPrice: 999,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
        images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2"],
        sizes: ["5", "6", "7", "8", "9"],
        colors: ["Black", "Beige"],
        variants: [
            { size: "5", color: "Black", stock: 7 },
            { size: "6", color: "Black", stock: 12 },
            { size: "7", color: "Black", stock: 14 },
            { size: "8", color: "Black", stock: 11 },
            { size: "9", color: "Black", stock: 7 }
        ],
        stock: 51,
        rating: 4.5,
        reviewCount: 83,
        isActive: true
    },

    {
        name: "Canvas Slip On Shoes",
        description: "Lightweight canvas slip-ons for relaxed everyday styling.",
        brand: "MoveX",
        category: "Footwear",
        subcategory: "Casual Shoes",
        gender: "Unisex",
        price: 1299,
        discountPrice: 899,
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
        images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77"],
        sizes: ["6", "7", "8", "9", "10"],
        colors: ["Black", "White"],
        variants: [
            { size: "6", color: "Black", stock: 8 },
            { size: "7", color: "Black", stock: 13 },
            { size: "8", color: "Black", stock: 15 },
            { size: "9", color: "Black", stock: 12 },
            { size: "10", color: "Black", stock: 7 }
        ],
        stock: 55,
        rating: 4.4,
        reviewCount: 96,
        isActive: true
    },

    {
        name: "Classic Leather Belt",
        description: "Durable leather belt with a clean classic buckle.",
        brand: "Executive Wear",
        category: "Accessories",
        subcategory: "Belts",
        gender: "Men",
        price: 999,
        discountPrice: 699,
        image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc",
        images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc"],
        sizes: ["30", "32", "34", "36", "38"],
        colors: ["Black", "Brown"],
        variants: [
            { size: "30", color: "Black", stock: 8 },
            { size: "32", color: "Black", stock: 12 },
            { size: "34", color: "Black", stock: 14 },
            { size: "36", color: "Black", stock: 10 },
            { size: "38", color: "Black", stock: 6 }
        ],
        stock: 50,
        rating: 4.5,
        reviewCount: 63,
        isActive: true
    },

    {
        name: "Classic Analog Watch",
        description: "Minimal analog watch with a clean timeless dial.",
        brand: "TimeCraft",
        category: "Accessories",
        subcategory: "Watches",
        gender: "Unisex",
        price: 2499,
        discountPrice: 1799,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30"],
        sizes: ["One Size"],
        colors: ["Black", "Silver"],
        variants: [
            { size: "One Size", color: "Black", stock: 14 },
            { size: "One Size", color: "Silver", stock: 11 }
        ],
        stock: 25,
        rating: 4.7,
        reviewCount: 117,
        isActive: true
    },

    {
        name: "Minimal Sunglasses",
        description: "Modern sunglasses with a lightweight frame for everyday use.",
        brand: "VisionX",
        category: "Accessories",
        subcategory: "Sunglasses",
        gender: "Unisex",
        price: 1199,
        discountPrice: 799,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
        images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083"],
        sizes: ["One Size"],
        colors: ["Black"],
        variants: [
            { size: "One Size", color: "Black", stock: 28 }
        ],
        stock: 28,
        rating: 4.4,
        reviewCount: 58,
        isActive: true
    },

    {
        name: "Everyday Canvas Backpack",
        description: "Spacious canvas backpack with multiple compartments.",
        brand: "Street Mode",
        category: "Accessories",
        subcategory: "Backpacks",
        gender: "Unisex",
        price: 1699,
        discountPrice: 1199,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62"],
        sizes: ["One Size"],
        colors: ["Black", "Green"],
        variants: [
            { size: "One Size", color: "Black", stock: 17 },
            { size: "One Size", color: "Green", stock: 13 }
        ],
        stock: 30,
        rating: 4.6,
        reviewCount: 87,
        isActive: true
    },

    {
        name: "Compact Crossbody Bag",
        description: "Compact crossbody bag for everyday essentials.",
        brand: "Luna Accessories",
        category: "Accessories",
        subcategory: "Bags",
        gender: "Women",
        price: 1599,
        discountPrice: 1099,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3"],
        sizes: ["One Size"],
        colors: ["Black", "Brown"],
        variants: [
            { size: "One Size", color: "Black", stock: 15 },
            { size: "One Size", color: "Brown", stock: 12 }
        ],
        stock: 27,
        rating: 4.5,
        reviewCount: 69,
        isActive: true
    },

    {
        name: "Everyday Cotton Cap",
        description: "Adjustable cotton cap with a simple everyday design.",
        brand: "Street Mode",
        category: "Accessories",
        subcategory: "Caps",
        gender: "Unisex",
        price: 699,
        discountPrice: 449,
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee",
        images: ["https://images.unsplash.com/photo-1521369909029-2afed882baee"],
        sizes: ["One Size"],
        colors: ["Black", "Navy", "White"],
        variants: [
            { size: "One Size", color: "Black", stock: 18 },
            { size: "One Size", color: "Navy", stock: 14 },
            { size: "One Size", color: "White", stock: 12 }
        ],
        stock: 44,
        rating: 4.3,
        reviewCount: 47,
        isActive: true
    },

    {
        name: "Soft Cotton Scarf",
        description: "Lightweight cotton scarf suitable for casual styling.",
        brand: "Luna Accessories",
        category: "Accessories",
        subcategory: "Scarves",
        gender: "Women",
        price: 799,
        discountPrice: 549,
        image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26",
        images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26"],
        sizes: ["One Size"],
        colors: ["Cream", "Pink"],
        variants: [
            { size: "One Size", color: "Cream", stock: 18 },
            { size: "One Size", color: "Pink", stock: 14 }
        ],
        stock: 32,
        rating: 4.4,
        reviewCount: 39,
        isActive: true
    },

    {
        name: "Oversized Beige T-Shirt",
        description: "Relaxed oversized t-shirt in a neutral beige tone.",
        brand: "Urban Thread",
        category: "Clothing",
        subcategory: "T-Shirts",
        gender: "Unisex",
        price: 999,
        discountPrice: 699,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Beige"],
        variants: [
            { size: "S", color: "Beige", stock: 10 },
            { size: "M", color: "Beige", stock: 16 },
            { size: "L", color: "Beige", stock: 13 },
            { size: "XL", color: "Beige", stock: 8 }
        ],
        stock: 47,
        rating: 4.6,
        reviewCount: 93,
        isActive: true
    },

    {
        name: "Navy Basic T-Shirt",
        description: "Classic navy cotton t-shirt for everyday wear.",
        brand: "Urban Thread",
        category: "Clothing",
        subcategory: "T-Shirts",
        gender: "Men",
        price: 899,
        discountPrice: 599,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Navy"],
        variants: [
            { size: "S", color: "Navy", stock: 9 },
            { size: "M", color: "Navy", stock: 15 },
            { size: "L", color: "Navy", stock: 14 },
            { size: "XL", color: "Navy", stock: 8 }
        ],
        stock: 46,
        rating: 4.4,
        reviewCount: 71,
        isActive: true
    },

    {
        name: "Women's Pink Casual Dress",
        description: "Lightweight casual dress with a comfortable relaxed silhouette.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Dresses",
        gender: "Women",
        price: 1799,
        discountPrice: 1299,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
        images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8"],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Pink"],
        variants: [
            { size: "XS", color: "Pink", stock: 7 },
            { size: "S", color: "Pink", stock: 13 },
            { size: "M", color: "Pink", stock: 14 },
            { size: "L", color: "Pink", stock: 8 }
        ],
        stock: 42,
        rating: 4.6,
        reviewCount: 84,
        isActive: true
    },

    {
        name: "Women's Black Midi Dress",
        description: "Elegant black midi dress suitable for casual and evening occasions.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Dresses",
        gender: "Women",
        price: 2199,
        discountPrice: 1599,
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956",
        images: ["https://images.unsplash.com/photo-1539008835657-9e8e9680c956"],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black"],
        variants: [
            { size: "XS", color: "Black", stock: 6 },
            { size: "S", color: "Black", stock: 12 },
            { size: "M", color: "Black", stock: 13 },
            { size: "L", color: "Black", stock: 7 }
        ],
        stock: 38,
        rating: 4.7,
        reviewCount: 102,
        isActive: true
    },

    {
        name: "Women's Denim Jacket",
        description: "Classic blue denim jacket with a relaxed modern fit.",
        brand: "Denim Works",
        category: "Clothing",
        subcategory: "Jackets",
        gender: "Women",
        price: 2399,
        discountPrice: 1799,
        image: "https://images.unsplash.com/photo-1548883354-7622d03aca27",
        images: ["https://images.unsplash.com/photo-1548883354-7622d03aca27"],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Blue"],
        variants: [
            { size: "XS", color: "Blue", stock: 7 },
            { size: "S", color: "Blue", stock: 13 },
            { size: "M", color: "Blue", stock: 14 },
            { size: "L", color: "Blue", stock: 8 }
        ],
        stock: 42,
        rating: 4.6,
        reviewCount: 77,
        isActive: true
    },

    {
        name: "Men's Bomber Jacket",
        description: "Modern bomber jacket designed for casual everyday outfits.",
        brand: "Street Mode",
        category: "Clothing",
        subcategory: "Jackets",
        gender: "Men",
        price: 2999,
        discountPrice: 2199,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
        images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Olive"],
        variants: [
            { size: "S", color: "Black", stock: 6 },
            { size: "M", color: "Black", stock: 12 },
            { size: "L", color: "Black", stock: 13 },
            { size: "XL", color: "Black", stock: 7 }
        ],
        stock: 38,
        rating: 4.7,
        reviewCount: 89,
        isActive: true
    },

    {
        name: "Men's Checked Casual Shirt",
        description: "Classic checked shirt with a comfortable regular fit.",
        brand: "Street Mode",
        category: "Clothing",
        subcategory: "Shirts",
        gender: "Men",
        price: 1299,
        discountPrice: 899,
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157",
        images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue", "Red"],
        variants: [
            { size: "S", color: "Blue", stock: 8 },
            { size: "M", color: "Blue", stock: 15 },
            { size: "L", color: "Blue", stock: 13 },
            { size: "XL", color: "Blue", stock: 7 }
        ],
        stock: 43,
        rating: 4.4,
        reviewCount: 68,
        isActive: true
    },

    {
        name: "Men's Slim Fit Chinos",
        description: "Versatile slim-fit chinos suitable for casual and smart-casual looks.",
        brand: "Executive Wear",
        category: "Clothing",
        subcategory: "Chinos",
        gender: "Men",
        price: 1799,
        discountPrice: 1299,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a",
        images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a"],
        sizes: ["30", "32", "34", "36"],
        colors: ["Beige"],
        variants: [
            { size: "30", color: "Beige", stock: 8 },
            { size: "32", color: "Beige", stock: 14 },
            { size: "34", color: "Beige", stock: 13 },
            { size: "36", color: "Beige", stock: 8 }
        ],
        stock: 43,
        rating: 4.5,
        reviewCount: 73,
        isActive: true
    },

    {
        name: "Women's High Waist Black Jeans",
        description: "High-waisted black jeans with a flattering everyday fit.",
        brand: "Denim Works",
        category: "Clothing",
        subcategory: "Jeans",
        gender: "Women",
        price: 2199,
        discountPrice: 1599,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
        images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246"],
        sizes: ["26", "28", "30", "32"],
        colors: ["Black"],
        variants: [
            { size: "26", color: "Black", stock: 7 },
            { size: "28", color: "Black", stock: 13 },
            { size: "30", color: "Black", stock: 14 },
            { size: "32", color: "Black", stock: 8 }
        ],
        stock: 42,
        rating: 4.7,
        reviewCount: 119,
        isActive: true
    },

    {
        name: "Women's Pleated Skirt",
        description: "Flowing pleated skirt with a comfortable elegant fit.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Skirts",
        gender: "Women",
        price: 1499,
        discountPrice: 999,
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27",
        images: ["https://images.unsplash.com/photo-1583496661160-fb5886a13d27"],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Beige", "Black"],
        variants: [
            { size: "XS", color: "Beige", stock: 7 },
            { size: "S", color: "Beige", stock: 13 },
            { size: "M", color: "Beige", stock: 14 },
            { size: "L", color: "Beige", stock: 8 }
        ],
        stock: 42,
        rating: 4.5,
        reviewCount: 62,
        isActive: true
    },

    {
        name: "Women's Casual Blazer",
        description: "Smart casual blazer suitable for work and evening outfits.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Blazers",
        gender: "Women",
        price: 2999,
        discountPrice: 2199,
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
        images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3"],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black"],
        variants: [
            { size: "XS", color: "Black", stock: 6 },
            { size: "S", color: "Black", stock: 11 },
            { size: "M", color: "Black", stock: 13 },
            { size: "L", color: "Black", stock: 7 }
        ],
        stock: 37,
        rating: 4.7,
        reviewCount: 57,
        isActive: true
    },

    {
        name: "Classic Polo T-Shirt",
        description: "Premium cotton polo shirt with a clean classic collar.",
        brand: "Urban Thread",
        category: "Clothing",
        subcategory: "Polo Shirts",
        gender: "Men",
        price: 1299,
        discountPrice: 949,
        image: "https://images.unsplash.com/photo-1625910513413-5fc45b7d0f8a",
        images: ["https://images.unsplash.com/photo-1625910513413-5fc45b7d0f8a"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Navy"],
        variants: [
            { size: "S", color: "White", stock: 8 },
            { size: "M", color: "White", stock: 15 },
            { size: "L", color: "White", stock: 13 },
            { size: "XL", color: "White", stock: 7 }
        ],
        stock: 43,
        rating: 4.5,
        reviewCount: 79,
        isActive: true
    },

    {
        name: "Relaxed Cotton Shorts",
        description: "Comfortable cotton shorts for casual everyday wear.",
        brand: "Street Mode",
        category: "Clothing",
        subcategory: "Shorts",
        gender: "Men",
        price: 999,
        discountPrice: 699,
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b",
        images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Grey"],
        variants: [
            { size: "S", color: "Black", stock: 9 },
            { size: "M", color: "Black", stock: 15 },
            { size: "L", color: "Black", stock: 13 },
            { size: "XL", color: "Black", stock: 8 }
        ],
        stock: 45,
        rating: 4.4,
        reviewCount: 55,
        isActive: true
    },

    {
        name: "Premium Jogger Pants",
        description: "Soft stretch joggers designed for comfort and casual styling.",
        brand: "Urban Thread",
        category: "Clothing",
        subcategory: "Joggers",
        gender: "Unisex",
        price: 1499,
        discountPrice: 1049,
        image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea",
        images: ["https://images.unsplash.com/photo-1552902865-b72c031ac5ea"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Grey"],
        variants: [
            { size: "S", color: "Black", stock: 10 },
            { size: "M", color: "Black", stock: 16 },
            { size: "L", color: "Black", stock: 14 },
            { size: "XL", color: "Black", stock: 8 }
        ],
        stock: 48,
        rating: 4.6,
        reviewCount: 98,
        isActive: true
    },

    {
        name: "Warm Knit Sweater",
        description: "Soft knit sweater designed for comfortable winter layering.",
        brand: "Urban Thread",
        category: "Clothing",
        subcategory: "Sweaters",
        gender: "Unisex",
        price: 1799,
        discountPrice: 1299,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
        images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Cream", "Brown"],
        variants: [
            { size: "S", color: "Cream", stock: 8 },
            { size: "M", color: "Cream", stock: 14 },
            { size: "L", color: "Cream", stock: 13 },
            { size: "XL", color: "Cream", stock: 7 }
        ],
        stock: 42,
        rating: 4.7,
        reviewCount: 86,
        isActive: true
    },

    {
        name: "Lightweight Windbreaker",
        description: "Lightweight windbreaker jacket suitable for outdoor activities.",
        brand: "MoveX",
        category: "Clothing",
        subcategory: "Jackets",
        gender: "Unisex",
        price: 2299,
        discountPrice: 1699,
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f",
        images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5f"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Blue"],
        variants: [
            { size: "S", color: "Black", stock: 7 },
            { size: "M", color: "Black", stock: 12 },
            { size: "L", color: "Black", stock: 13 },
            { size: "XL", color: "Black", stock: 8 }
        ],
        stock: 40,
        rating: 4.6,
        reviewCount: 74,
        isActive: true
    },

    {
        name: "Performance Running Shoes",
        description: "Lightweight running shoes with cushioned soles.",
        brand: "MoveX",
        category: "Footwear",
        subcategory: "Running Shoes",
        gender: "Men",
        price: 2999,
        discountPrice: 2199,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
        sizes: ["7", "8", "9", "10", "11"],
        colors: ["Red", "Black"],
        variants: [
            { size: "7", color: "Red", stock: 7 },
            { size: "8", color: "Red", stock: 12 },
            { size: "9", color: "Red", stock: 14 },
            { size: "10", color: "Red", stock: 11 },
            { size: "11", color: "Red", stock: 6 }
        ],
        stock: 50,
        rating: 4.8,
        reviewCount: 141,
        isActive: true
    },

    {
        name: "Women's Casual Sneakers",
        description: "Comfortable everyday sneakers with a clean modern design.",
        brand: "MoveX",
        category: "Footwear",
        subcategory: "Sneakers",
        gender: "Women",
        price: 2199,
        discountPrice: 1599,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
        images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2"],
        sizes: ["5", "6", "7", "8", "9"],
        colors: ["White"],
        variants: [
            { size: "5", color: "White", stock: 7 },
            { size: "6", color: "White", stock: 12 },
            { size: "7", color: "White", stock: 15 },
            { size: "8", color: "White", stock: 12 },
            { size: "9", color: "White", stock: 7 }
        ],
        stock: 53,
        rating: 4.7,
        reviewCount: 112,
        isActive: true
    },

    {
        name: "Classic Canvas Shoes",
        description: "Simple canvas shoes suitable for casual everyday outfits.",
        brand: "MoveX",
        category: "Footwear",
        subcategory: "Casual Shoes",
        gender: "Unisex",
        price: 1199,
        discountPrice: 799,
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
        images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77"],
        sizes: ["6", "7", "8", "9", "10"],
        colors: ["Black"],
        variants: [
            { size: "6", color: "Black", stock: 8 },
            { size: "7", color: "Black", stock: 14 },
            { size: "8", color: "Black", stock: 16 },
            { size: "9", color: "Black", stock: 13 },
            { size: "10", color: "Black", stock: 8 }
        ],
        stock: 59,
        rating: 4.3,
        reviewCount: 89,
        isActive: true
    },

    {
        name: "Women's Ankle Boots",
        description: "Classic ankle boots with a versatile modern design.",
        brand: "Luna Accessories",
        category: "Footwear",
        subcategory: "Boots",
        gender: "Women",
        price: 2999,
        discountPrice: 2199,
        image: "https://images.unsplash.com/photo-1542834281-9b7d4f8f5e18",
        images: ["https://images.unsplash.com/photo-1542834281-9b7d4f8f5e18"],
        sizes: ["5", "6", "7", "8", "9"],
        colors: ["Black"],
        variants: [
            { size: "5", color: "Black", stock: 6 },
            { size: "6", color: "Black", stock: 11 },
            { size: "7", color: "Black", stock: 13 },
            { size: "8", color: "Black", stock: 10 },
            { size: "9", color: "Black", stock: 6 }
        ],
        stock: 46,
        rating: 4.6,
        reviewCount: 61,
        isActive: true
    },

    {
        name: "Minimal Leather Wallet",
        description: "Compact leather wallet with multiple card slots.",
        brand: "Executive Wear",
        category: "Accessories",
        subcategory: "Wallets",
        gender: "Men",
        price: 999,
        discountPrice: 699,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93",
        images: ["https://images.unsplash.com/photo-1627123424574-724758594e93"],
        sizes: ["One Size"],
        colors: ["Black", "Brown"],
        variants: [
            { size: "One Size", color: "Black", stock: 20 },
            { size: "One Size", color: "Brown", stock: 15 }
        ],
        stock: 35,
        rating: 4.6,
        reviewCount: 93,
        isActive: true
    },

    {
        name: "Structured Tote Bag",
        description: "Spacious tote bag suitable for work and everyday use.",
        brand: "Luna Accessories",
        category: "Accessories",
        subcategory: "Bags",
        gender: "Women",
        price: 1999,
        discountPrice: 1499,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3"],
        sizes: ["One Size"],
        colors: ["Brown", "Black"],
        variants: [
            { size: "One Size", color: "Brown", stock: 14 },
            { size: "One Size", color: "Black", stock: 12 }
        ],
        stock: 26,
        rating: 4.5,
        reviewCount: 67,
        isActive: true
    },

    {
        name: "Classic Aviator Sunglasses",
        description: "Timeless aviator sunglasses with a lightweight metal frame.",
        brand: "VisionX",
        category: "Accessories",
        subcategory: "Sunglasses",
        gender: "Unisex",
        price: 1299,
        discountPrice: 899,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
        images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083"],
        sizes: ["One Size"],
        colors: ["Black", "Gold"],
        variants: [
            { size: "One Size", color: "Black", stock: 18 },
            { size: "One Size", color: "Gold", stock: 14 }
        ],
        stock: 32,
        rating: 4.5,
        reviewCount: 82,
        isActive: true
    },

    {
        name: "Minimal Silver Watch",
        description: "Elegant silver-tone analog watch with a minimalist dial.",
        brand: "TimeCraft",
        category: "Accessories",
        subcategory: "Watches",
        gender: "Unisex",
        price: 2799,
        discountPrice: 1999,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30"],
        sizes: ["One Size"],
        colors: ["Silver"],
        variants: [
            { size: "One Size", color: "Silver", stock: 24 }
        ],
        stock: 24,
        rating: 4.8,
        reviewCount: 126,
        isActive: true
    },

    {
        name: "Travel Duffle Bag",
        description: "Spacious duffle bag designed for short trips and weekend travel.",
        brand: "Street Mode",
        category: "Accessories",
        subcategory: "Travel Bags",
        gender: "Unisex",
        price: 2199,
        discountPrice: 1599,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62"],
        sizes: ["One Size"],
        colors: ["Black"],
        variants: [
            { size: "One Size", color: "Black", stock: 21 }
        ],
        stock: 21,
        rating: 4.6,
        reviewCount: 73,
        isActive: true
    },

    {
        name: "Cotton Beanie",
        description: "Soft cotton beanie for comfortable cold-weather styling.",
        brand: "Urban Thread",
        category: "Accessories",
        subcategory: "Beanies",
        gender: "Unisex",
        price: 699,
        discountPrice: 449,
        image: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc",
        images: ["https://images.unsplash.com/photo-1575428652377-a2d80e2277fc"],
        sizes: ["One Size"],
        colors: ["Black", "Grey"],
        variants: [
            { size: "One Size", color: "Black", stock: 17 },
            { size: "One Size", color: "Grey", stock: 15 }
        ],
        stock: 32,
        rating: 4.3,
        reviewCount: 41,
        isActive: true
    },

    {
        name: "Women's Knit Cardigan",
        description: "Soft knit cardigan perfect for layering in cooler weather.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Cardigans",
        gender: "Women",
        price: 1799,
        discountPrice: 1299,
        image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6",
        images: ["https://images.unsplash.com/photo-1618932260643-eee4a2f652a6"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Cream"],
        variants: [
            { size: "S", color: "Cream", stock: 8 },
            { size: "M", color: "Cream", stock: 14 },
            { size: "L", color: "Cream", stock: 12 },
            { size: "XL", color: "Cream", stock: 7 }
        ],
        stock: 41,
        rating: 4.7,
        reviewCount: 71,
        isActive: true
    },

    {
        name: "Men's Formal Oxford Shirt",
        description: "Crisp cotton oxford shirt for formal and business-casual outfits.",
        brand: "Executive Wear",
        category: "Clothing",
        subcategory: "Formal Shirts",
        gender: "Men",
        price: 1599,
        discountPrice: 1199,
        image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab",
        images: ["https://images.unsplash.com/photo-1603252110481-7ba873bf42ab"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White"],
        variants: [
            { size: "S", color: "White", stock: 8 },
            { size: "M", color: "White", stock: 15 },
            { size: "L", color: "White", stock: 14 },
            { size: "XL", color: "White", stock: 10 },
            { size: "XXL", color: "White", stock: 6 }
        ],
        stock: 53,
        rating: 4.7,
        reviewCount: 94,
        isActive: true
    },

    {
        name: "Women's Satin Blouse",
        description: "Elegant satin blouse suitable for formal and evening outfits.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Blouses",
        gender: "Women",
        price: 1599,
        discountPrice: 1149,
        image: "https://images.unsplash.com/photo-1564257577054-0d7a4b5f1c5a",
        images: ["https://images.unsplash.com/photo-1564257577054-0d7a4b5f1c5a"],
        sizes: ["XS", "S", "M", "L"],
        colors: ["White", "Black"],
        variants: [
            { size: "XS", color: "White", stock: 7 },
            { size: "S", color: "White", stock: 13 },
            { size: "M", color: "White", stock: 14 },
            { size: "L", color: "White", stock: 8 }
        ],
        stock: 42,
        rating: 4.5,
        reviewCount: 56,
        isActive: true
    },

    {
        name: "Relaxed Fit Denim Shorts",
        description: "Casual denim shorts with a relaxed comfortable fit.",
        brand: "Denim Works",
        category: "Clothing",
        subcategory: "Shorts",
        gender: "Women",
        price: 1299,
        discountPrice: 899,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
        images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246"],
        sizes: ["26", "28", "30", "32"],
        colors: ["Blue"],
        variants: [
            { size: "26", color: "Blue", stock: 8 },
            { size: "28", color: "Blue", stock: 14 },
            { size: "30", color: "Blue", stock: 13 },
            { size: "32", color: "Blue", stock: 8 }
        ],
        stock: 43,
        rating: 4.4,
        reviewCount: 64,
        isActive: true
    },

    {
        name: "Everyday Ribbed Tank Top",
        description: "Soft stretch ribbed tank top for casual everyday wear.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Tops",
        gender: "Women",
        price: 799,
        discountPrice: 549,
        image: "https://images.unsplash.com/photo-1506629905607-d9c297d4b8a1",
        images: ["https://images.unsplash.com/photo-1506629905607-d9c297d4b8a1"],
        sizes: ["XS", "S", "M", "L"],
        colors: ["White", "Black"],
        variants: [
            { size: "XS", color: "White", stock: 9 },
            { size: "S", color: "White", stock: 15 },
            { size: "M", color: "White", stock: 14 },
            { size: "L", color: "White", stock: 8 }
        ],
        stock: 46,
        rating: 4.4,
        reviewCount: 73,
        isActive: true
    },

    {
        name: "Men's Textured T-Shirt",
        description: "Textured cotton t-shirt with a modern relaxed silhouette.",
        brand: "Urban Thread",
        category: "Clothing",
        subcategory: "T-Shirts",
        gender: "Men",
        price: 999,
        discountPrice: 699,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Green"],
        variants: [
            { size: "S", color: "Green", stock: 8 },
            { size: "M", color: "Green", stock: 15 },
            { size: "L", color: "Green", stock: 13 },
            { size: "XL", color: "Green", stock: 7 }
        ],
        stock: 43,
        rating: 4.5,
        reviewCount: 59,
        isActive: true
    },

    {
        name: "Classic Denim Overshirt",
        description: "Versatile denim overshirt that works as a light jacket.",
        brand: "Denim Works",
        category: "Clothing",
        subcategory: "Overshirts",
        gender: "Unisex",
        price: 1999,
        discountPrice: 1499,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
        images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue"],
        variants: [
            { size: "S", color: "Blue", stock: 7 },
            { size: "M", color: "Blue", stock: 13 },
            { size: "L", color: "Blue", stock: 14 },
            { size: "XL", color: "Blue", stock: 8 }
        ],
        stock: 42,
        rating: 4.6,
        reviewCount: 81,
        isActive: true
    },

    {
        name: "Premium Black Trousers",
        description: "Smart straight-fit trousers suitable for formal occasions.",
        brand: "Executive Wear",
        category: "Clothing",
        subcategory: "Trousers",
        gender: "Men",
        price: 1999,
        discountPrice: 1499,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a",
        images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a"],
        sizes: ["30", "32", "34", "36"],
        colors: ["Black"],
        variants: [
            { size: "30", color: "Black", stock: 7 },
            { size: "32", color: "Black", stock: 14 },
            { size: "34", color: "Black", stock: 13 },
            { size: "36", color: "Black", stock: 8 }
        ],
        stock: 42,
        rating: 4.6,
        reviewCount: 75,
        isActive: true
    },

    {
        name: "Women's Casual Jumpsuit",
        description: "Comfortable casual jumpsuit with a modern relaxed fit.",
        brand: "Luna Wear",
        category: "Clothing",
        subcategory: "Jumpsuits",
        gender: "Women",
        price: 2299,
        discountPrice: 1699,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1",
        images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1"],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black"],
        variants: [
            { size: "XS", color: "Black", stock: 6 },
            { size: "S", color: "Black", stock: 12 },
            { size: "M", color: "Black", stock: 13 },
            { size: "L", color: "Black", stock: 7 }
        ],
        stock: 38,
        rating: 4.5,
        reviewCount: 48,
        isActive: true
    },

    {
        name: "Lightweight Summer Shorts",
        description: "Breathable summer shorts with a comfortable relaxed fit.",
        brand: "Street Mode",
        category: "Clothing",
        subcategory: "Shorts",
        gender: "Unisex",
        price: 899,
        discountPrice: 599,
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b",
        images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Beige"],
        variants: [
            { size: "S", color: "Beige", stock: 9 },
            { size: "M", color: "Beige", stock: 15 },
            { size: "L", color: "Beige", stock: 13 },
            { size: "XL", color: "Beige", stock: 8 }
        ],
        stock: 45,
        rating: 4.3,
        reviewCount: 52,
        isActive: true
    },

    {
        name: "Everyday Crew Neck Sweatshirt",
        description: "Classic crew neck sweatshirt made for everyday comfort.",
        brand: "Urban Thread",
        category: "Clothing",
        subcategory: "Sweatshirts",
        gender: "Unisex",
        price: 1399,
        discountPrice: 999,
        image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2",
        images: ["https://images.unsplash.com/photo-1578587018452-892bacefd3f2"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Navy"],
        variants: [
            { size: "S", color: "Navy", stock: 8 },
            { size: "M", color: "Navy", stock: 15 },
            { size: "L", color: "Navy", stock: 13 },
            { size: "XL", color: "Navy", stock: 7 }
        ],
        stock: 43,
        rating: 4.5,
        reviewCount: 69,
        isActive: true
    },

    {
        name: "Classic Leather Handbag",
        description: "Structured leather handbag designed for everyday use.",
        brand: "Luna Accessories",
        category: "Accessories",
        subcategory: "Handbags",
        gender: "Women",
        price: 2799,
        discountPrice: 1999,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3"],
        sizes: ["One Size"],
        colors: ["Brown", "Black"],
        variants: [
            { size: "One Size", color: "Brown", stock: 12 },
            { size: "One Size", color: "Black", stock: 14 }
        ],
        stock: 26,
        rating: 4.7,
        reviewCount: 88,
        isActive: true
    },

    {
        name: "Sport Performance Cap",
        description: "Lightweight performance cap designed for outdoor activities.",
        brand: "MoveX",
        category: "Accessories",
        subcategory: "Caps",
        gender: "Unisex",
        price: 799,
        discountPrice: 549,
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee",
        images: ["https://images.unsplash.com/photo-1521369909029-2afed882baee"],
        sizes: ["One Size"],
        colors: ["Black", "Blue"],
        variants: [
            { size: "One Size", color: "Black", stock: 21 },
            { size: "One Size", color: "Blue", stock: 17 }
        ],
        stock: 38,
        rating: 4.4,
        reviewCount: 44,
        isActive: true
    },

    {
        name: "Premium Travel Backpack",
        description: "Large travel backpack with multiple organized compartments.",
        brand: "Street Mode",
        category: "Accessories",
        subcategory: "Backpacks",
        gender: "Unisex",
        price: 2499,
        discountPrice: 1799,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62"],
        sizes: ["One Size"],
        colors: ["Black"],
        variants: [
            { size: "One Size", color: "Black", stock: 24 }
        ],
        stock: 24,
        rating: 4.8,
        reviewCount: 116,
        isActive: true
    },

    {
        name: "Minimal Chain Bracelet",
        description: "Simple chain bracelet with a clean modern appearance.",
        brand: "Luna Accessories",
        category: "Accessories",
        subcategory: "Jewelry",
        gender: "Women",
        price: 899,
        discountPrice: 599,
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d",
        images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343d"],
        sizes: ["One Size"],
        colors: ["Gold", "Silver"],
        variants: [
            { size: "One Size", color: "Gold", stock: 19 },
            { size: "One Size", color: "Silver", stock: 17 }
        ],
        stock: 36,
        rating: 4.4,
        reviewCount: 51,
        isActive: true
    },

    {
        name: "Classic Cotton Socks Pack",
        description: "Comfortable cotton socks suitable for everyday wear.",
        brand: "Urban Thread",
        category: "Accessories",
        subcategory: "Socks",
        gender: "Unisex",
        price: 599,
        discountPrice: 399,
        image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82",
        images: ["https://images.unsplash.com/photo-1586350977771-b3b0abd50c82"],
        sizes: ["S", "M", "L"],
        colors: ["White", "Black"],
        variants: [
            { size: "S", color: "White", stock: 15 },
            { size: "M", color: "White", stock: 20 },
            { size: "L", color: "White", stock: 16 }
        ],
        stock: 51,
        rating: 4.3,
        reviewCount: 38,
        isActive: true
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