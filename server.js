const express = require('express');
const path = require('path');
const db = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Serve static files (CSS, JS, images) from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (for form submissions later)
app.use(express.urlencoded({ extended: true }));

// A simple test route
app.get('/', (req, res) => {
    res.send('<h1>Media Share App is running!</h1><p>Awaiting further instructions, manager.</p>');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}`);
});