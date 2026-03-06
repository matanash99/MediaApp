const db = require('../config/db');

exports.getGallery = (req, res) => {
    db.all(`SELECT * FROM videos ORDER BY upload_date DESC`, [], (err, videos) => {
        if (err) return res.status(500).send('Database error.');

        let heroVideo = null;
        const movies = [];
        const seriesMap = new Map();

        videos.forEach(video => {
            if (video.is_recommended) heroVideo = video;

            if (!video.series_name) {
                movies.push(video);
            } else {
                if (!seriesMap.has(video.series_name)) {
                    seriesMap.set(video.series_name, video);
                } else if (!seriesMap.get(video.series_name).series_poster && video.series_poster) {
                    // If a later episode has the series poster, grab it
                    seriesMap.get(video.series_name).series_poster = video.series_poster;
                }
            }
        });

        res.render('gallery', { heroVideo, movies, seriesList: Array.from(seriesMap.values()), user: req.session });
    });
};

// NEW: The Series Hub Controller
exports.getSeriesHub = (req, res) => {
    const seriesName = req.params.name;

    // Fetch all episodes for this specific series, sorted by season and episode
    db.all(`SELECT * FROM videos WHERE series_name = ? ORDER BY season_number, episode_number`, 
    [seriesName], (err, episodes) => {
        if (err) return res.status(500).send('Database error.');

        // Group the episodes by Season Number for the UI rows
        const seasons = {};
        episodes.forEach(ep => {
            if (!seasons[ep.season_number]) seasons[ep.season_number] = [];
            seasons[ep.season_number].push(ep);
        });

        res.render('seriesHub', { seriesName, seasons, user: req.session });
    });
};

// Get the Watch Video Page (Updated to fetch comments)
exports.getWatchPage = (req, res) => {
    const videoId = req.params.id;

    // 1. Get the Video
    db.get(`SELECT * FROM videos WHERE id = ?`, [videoId], (err, video) => {
        if (err || !video) return res.status(404).send('Video not found.');

        // 2. Get the Comments for this video
        db.all(`SELECT comments.*, users.username 
                FROM comments 
                JOIN users ON comments.user_id = users.id 
                WHERE video_id = ? 
                ORDER BY timestamp DESC`, [videoId], (err, comments) => {
            
            res.render('watch', { 
                video: video, 
                user: req.session, 
                comments: comments || [] // Send empty list if no comments
            });
        });
    });
};

// Post a new comment
exports.postComment = (req, res) => {
    const videoId = req.params.id;
    const { comment_text } = req.body;
    const userId = req.session.userId;

    if (!comment_text || comment_text.trim() === '') return res.redirect(`/watch/${videoId}`);

    db.run(`INSERT INTO comments (video_id, user_id, comment_text) VALUES (?, ?, ?)`, 
    [videoId, userId, comment_text], (err) => {
        if (err) console.error(err.message);
        res.redirect(`/watch/${videoId}`);
    });
};

// Delete a comment
exports.deleteComment = (req, res) => {
    const commentId = req.params.commentId;
    const videoId = req.params.videoId;
    const userId = req.session.userId;
    const userRole = req.session.role;

    // First, find the comment to check ownership
    db.get(`SELECT user_id FROM comments WHERE id = ?`, [commentId], (err, comment) => {
        if (err || !comment) return res.redirect(`/watch/${videoId}`);

        // Only allow deletion if the user is the owner OR an admin
        if (comment.user_id === userId || userRole === 'admin') {
            db.run(`DELETE FROM comments WHERE id = ?`, [commentId], (err) => {
                if (err) console.error(err.message);
                res.redirect(`/watch/${videoId}`);
            });
        } else {
            res.status(403).send("You don't have permission to delete this.");
        }
    });
};