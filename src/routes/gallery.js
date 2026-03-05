const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const requireAuth = require('../middleware/requireAuth');

// The main gallery page
router.get('/gallery', requireAuth, galleryController.getGallery);

// The video player page (Protected by requireAuth so friends can watch too)
router.get('/watch/:id', requireAuth, galleryController.getWatchPage);

module.exports = router;