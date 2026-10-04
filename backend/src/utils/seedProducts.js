const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/productModel');

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB connected');

        const response = await fetch(
            'https://dummyjson.com/products?limit=0'
        );

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await response.json();

        const products = data.products.map((product) => ({
            name: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.thumbnail,
            stock: product.stock
        }));

        await Product.deleteMany();

        await Product.insertMany(products);

        console.log(`${products.length} products inserted successfully`);

    } catch (error) {
        console.error('Error seeding products:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

seedProducts();