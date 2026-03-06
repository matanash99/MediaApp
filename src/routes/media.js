const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const upload = require('../middleware/upload');
const requireAdmin = require('../middleware/requireAdmin');

// 1. Show the Dashboard (Protected by requireAdmin)
router.get('/dashboard', requireAdmin, mediaController.getDashboard);

// 2. Handle the Upload
// We tell Multer to expect a video, an optional subtitle, and an optional thumbnail image
router.post('/dashboard/upload', requireAdmin, upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'subtitle', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'series_poster', maxCount: 1 }
]), mediaController.uploadMedia);

// 3. Handle Deleting Media
router.post('/dashboard/delete/:id', requireAdmin, mediaController.deleteMedia);

// 4. Handle Setting the Hero Recommendation
router.post('/dashboard/recommend/:id', requireAdmin, mediaController.setRecommendation);


module.exports = router;