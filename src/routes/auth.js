const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET request to show the login page
router.get('/login', authController.getLogin);

// POST request when the user clicks "Submit" on the login form
router.post('/login', authController.postLogin);

// GET request to log out
router.get('/logout', authController.logout);

module.exports = router;