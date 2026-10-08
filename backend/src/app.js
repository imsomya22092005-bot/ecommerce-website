const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/auth/google', googleAuthRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'E-commerce API is running'
    });
});

module.exports = app;