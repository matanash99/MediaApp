const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const requireAuth = require('../middleware/requireAuth');

// The main gallery page
router.get('/gallery', requireAuth, galleryController.getGallery);

// The high-speed video streaming route
router.get('/play/:filename', requireAuth, galleryController.streamVideo);

// The video player page (Protected by requireAuth so friends can watch too)
router.get('/watch/:id', requireAuth, galleryController.getWatchPage);

// Post a comment (Protected by requireAuth)
router.post('/watch/:id/comment', requireAuth, galleryController.postComment);

// Delete a comment
router.post('/watch/:videoId/comment/:commentId/delete', requireAuth, galleryController.deleteComment);

// Series Hub route
router.get('/series/:name', requireAuth, galleryController.getSeriesHub);

module.exports = router;