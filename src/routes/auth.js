const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Frontend View Routes
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

// Backend Action Routes
router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.get('/logout', authController.logoutUser);

module.exports = router;