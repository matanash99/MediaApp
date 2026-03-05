const db = require('../config/db');

exports.getGallery = (req, res) => {
    // Fetch all videos, ordering them so Series are grouped, and Episodes are in perfect numerical order
    db.all(`SELECT * FROM videos ORDER BY series_name, season_number, episode_number, upload_date DESC`, [], (err, videos) => {
        if (err) {
            console.error('Error fetching gallery:', err.message);
            return res.status(500).send('Database error.');
        }

        let heroVideo = null;
        const movies = [];
        const seriesData = {}; // This will group episodes by their Series Name

        videos.forEach(video => {
            // 1. Identify the Admin's Pick for the Hero Banner
            if (video.is_recommended) {
                heroVideo = video;
            }

            // 2. Separate Standalone Movies from TV Series
            if (!video.series_name) {
                movies.push(video);
            } else {
                // If the series doesn't exist in our group yet, create a new array for it
                if (!seriesData[video.series_name]) {
                    seriesData[video.series_name] = [];
                }
                // Push the episode into its specific series array
                seriesData[video.series_name].push(video);
            }
        });

        // Send all this organized data to the gallery view
        res.render('gallery', { 
            heroVideo, 
            movies, 
            seriesData, 
            user: req.session 
        });
    });
};

// Get the Watch Video Page
exports.getWatchPage = (req, res) => {
    const videoId = req.params.id;

    db.get(`SELECT * FROM videos WHERE id = ?`, [videoId], (err, video) => {
        if (err) {
            console.error('Error fetching video:', err.message);
            return res.status(500).send('Database error.');
        }

        if (!video) {
            return res.status(404).send('Video not found.');
        }

        // Send the specific video data to the player page
        res.render('watch', { video: video, user: req.session });
    });
};