const express = require('express');

const {
    googleLogin
} = require('../controllers/googleAuthController');

const router = express.Router();

router.post('/login', googleLogin);

module.exports = router;