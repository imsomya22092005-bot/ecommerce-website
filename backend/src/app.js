const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

app.use(express.json());


app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'E-commerce API is running'
    });
});

module.exports = app;