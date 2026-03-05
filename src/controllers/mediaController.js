const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getDashboard = (req, res) => {
    db.all(`SELECT * FROM videos ORDER BY upload_date DESC`, [], (err, rows) => {
        if (err) {
            console.error('Error fetching videos:', err.message);
            return res.status(500).send('Database error.');
        }
        res.render('dashboard', { videos: rows, user: req.session });
    });
};

exports.uploadMedia = (req, res) => {
    // Grab all our new form fields
    const { title, series_name, season_number, episode_number } = req.body;
    const is_recommended = req.body.is_recommended === 'on' ? 1 : 0; // Checkbox logic
    
    if (!req.files || !req.files['video']) {
        return res.status(400).send('Video file is required.');
    }

    // Grab filenames from Multer
    const videoFile = req.files['video'][0].filename;
    const subtitleFile = req.files['subtitle'] ? req.files['subtitle'][0].filename : null;
    const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0].filename : null;

    // Helper function to insert the new video
    const insertVideo = () => {
        const query = `INSERT INTO videos (title, series_name, season_number, episode_number, video_path, subtitle_path, thumbnail_path, is_recommended) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(query, [title, series_name || null, season_number || null, episode_number || null, videoFile, subtitleFile, thumbnailFile, is_recommended], function(err) {
            if (err) {
                console.error('Error saving to database:', err.message);
                return res.status(500).send('Database error.');
            }
            console.log(`Successfully uploaded: ${title}`);
            res.redirect('/dashboard');
        });
    };

    // If this is the new recommendation, clear the old one first
    if (is_recommended) {
        db.run(`UPDATE videos SET is_recommended = 0`, [], (err) => {
            if (err) console.error('Error clearing old recommendations:', err.message);
            insertVideo();
        });
    } else {
        insertVideo();
    }
};

exports.deleteMedia = (req, res) => {
    const videoId = req.params.id;

    db.get(`SELECT video_path, subtitle_path, thumbnail_path FROM videos WHERE id = ?`, [videoId], (err, row) => {
        if (err || !row) return res.status(404).send('Video not found.');

        db.run(`DELETE FROM videos WHERE id = ?`, [videoId], (deleteErr) => {
            if (deleteErr) return res.status(500).send('Database error.');

            try {
                // Delete all three potential files to keep your Surface hard drive clean!
                const videoPath = path.join(__dirname, '../../uploads/videos', row.video_path);
                if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);

                if (row.subtitle_path) {
                    const subPath = path.join(__dirname, '../../uploads/subtitles', row.subtitle_path);
                    if (fs.existsSync(subPath)) fs.unlinkSync(subPath);
                }

                if (row.thumbnail_path) {
                    const thumbPath = path.join(__dirname, '../../uploads/thumbnails', row.thumbnail_path);
                    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
                }
            } catch (fsErr) {
                console.error('Error deleting files from disk:', fsErr);
            }
            res.redirect('/dashboard');
        });
    });
};

// 4. Set a Video as the Recommendation (Hero Banner)
exports.setRecommendation = (req, res) => {
    const videoId = req.params.id;

    // First, clear any existing recommendations
    db.run(`UPDATE videos SET is_recommended = 0`, [], (err) => {
        if (err) {
            console.error('Error clearing recommendations:', err.message);
            return res.status(500).send('Database error.');
        }

        // Then, set the chosen video as the new recommendation
        db.run(`UPDATE videos SET is_recommended = 1 WHERE id = ?`, [videoId], (updateErr) => {
            if (updateErr) {
                console.error('Error setting new recommendation:', updateErr.message);
                return res.status(500).send('Database error.');
            }
            console.log(`Video ID ${videoId} is now the Hero Recommendation.`);
            res.redirect('/dashboard');
        });
    });
};