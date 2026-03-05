require('dotenv').config(); // Loads variables from your .env file
const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./src/config/db');

// Import our new auth routes
const authRoutes = require('./src/routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

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

// A simple test route to verify logins
app.get('/', (req, res) => {
    if (req.session.userId) {
        // If they are logged in, show their info
        res.send(`
            <h1>Welcome to the Media App!</h1>
            <p>Logged in as: <strong>${req.session.username}</strong></p>
            <p>Role: <strong>${req.session.role}</strong></p>
            <a href="/logout">Logout</a>
        `);
    } else {
        // If not logged in, ask them to log in
        res.send(`
            <h1>Media Share App is running!</h1>
            <p><a href="/login">Click here to Login</a></p>
        `);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}`);
});