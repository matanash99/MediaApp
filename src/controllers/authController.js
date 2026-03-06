const db = require('../config/db');
const bcrypt = require('bcrypt');

// Handle Registration
exports.registerUser = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    // Check how many users exist to determine if this is the first user
    db.get(`SELECT COUNT(*) as count FROM users`, [], async (err, row) => {
        if (err) return res.status(500).send('Database error.');

        // If count is 0, this first person is the admin. Otherwise, standard user.
        const role = row.count === 0 ? 'admin' : 'user';
        
        try {
            // Salt and hash the password (10 encryption rounds)
            const hashedPassword = await bcrypt.hash(password, 10);

            db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, 
            [username, hashedPassword, role], function(insertErr) {
                if (insertErr) {
                    if (insertErr.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).send('Username already taken.');
                    }
                    return res.status(500).send('Error creating account.');
                }
                
                // Automatically log them in after registering
                req.session.userId = this.lastID;
                req.session.username = username;
                req.session.role = role;
                
                res.redirect('/gallery');
            });
        } catch (hashError) {
            res.status(500).send('Encryption error.');
        }
    });
};

// Handle Login
exports.loginUser = (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err) return res.status(500).send('Database error.');
        if (!user) return res.status(401).send('Invalid username or password.');

        // Compare the typed password with the encrypted hash in the database
        const match = await bcrypt.compare(password, user.password);
        
        if (match) {
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.role = user.role;
            res.redirect('/gallery');
        } else {
            res.status(401).send('Invalid username or password.');
        }
    });
};

// Handle Logout
exports.logoutUser = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};