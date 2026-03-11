require('dotenv').config(); // Loads variables from your .env file
const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./src/config/db');

// Import our routes
const galleryRoutes = require('./src/routes/gallery');
const authRoutes = require('./src/routes/auth');
const mediaRoutes = require('./src/routes/media');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Expose the uploads folder so the browser can read videos, subtitles, and thumbnails
const uploadPath = process.env.UPLOAD_DIRECTORY || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadPath));

// Parse URL-encoded bodies (for our login form)
app.use(express.urlencoded({ extended: true }));

// Configure Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Keep false for local development without HTTPS
        maxAge: 1000 * 60 * 60 * 24 * 7 // Remembers the login for 7 days
    }
}));

// Register Routes
app.use('/', authRoutes);
app.use('/', mediaRoutes);
app.use('/', galleryRoutes);

// Update the root route: Everyone goes straight to the Gallery!
app.get('/', (req, res) => {
    if (req.session.userId) {
        // If logged in (admin or friend), go to the Netflix showroom
        return res.redirect('/gallery'); 
    } else {
        // If not logged in, go to the bouncer
        res.redirect('/login');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}`);
});