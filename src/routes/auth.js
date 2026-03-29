const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Frontend View Routes
router.get('/login', (req, res) => res.render('login'));

// Backend Action Routes
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

module.exports = router;