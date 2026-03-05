const bcrypt = require('bcrypt');
const db = require('../config/db');

// Show the login page
exports.getLogin = (req, res) => {
    // If they are already logged in, send them to the homepage (or dashboard later)
    if (req.session.userId) {
        return res.redirect('/');
    }
    res.render('login', { error: null });
};

// Handle the login form submission
exports.postLogin = (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err) {
            console.error(err.message);
            return res.render('login', { error: 'An error occurred. Please try again.' });
        }

        // If user doesn't exist
        if (!user) {
            return res.render('login', { error: 'Invalid username or password.' });
        }

        // Compare the typed password with the hashed password in SQLite
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // Password is correct! Save their info in the session cookie
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.role = user.role; // 'admin' or 'user'

            console.log(`${user.username} logged in successfully.`);
            res.redirect('/'); // We will change this to redirect to a dashboard later
        } else {
            // Wrong password
            res.render('login', { error: 'Invalid username or password.' });
        }
    });
};

// Handle logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
};