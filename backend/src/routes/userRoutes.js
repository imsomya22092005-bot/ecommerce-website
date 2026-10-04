const express = require('express');

const router = express.Router();

const {
    getProfile,
    updateProfile,
    getAllUsers,
    getUserById
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


router.get('/profile',authMiddleware,getProfile);

router.get( '/', authMiddleware, adminMiddleware, getAllUsers);
router.get('/:id',authMiddleware,adminMiddleware,getUserById);
router.put('/profile',authMiddleware,updateProfile);


module.exports = router;