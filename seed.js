require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

// Connect to our existing database
const dbPath = path.join(__dirname, 'src', 'models', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const seedAdmin = async () => {
    // Pull credentials from your .env file
    const username = process.env.ADMIN_USERNAME;
    const plainTextPassword = process.env.ADMIN_PASSWORD;

    if (!username || !plainTextPassword) {
        console.error('Error: ADMIN_USERNAME or ADMIN_PASSWORD is missing in your .env file.');
        return db.close();
    }

    try {
        // 1. Check if the admin user already exists so we don't create duplicates
        db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
            if (err) {
                console.error('Database error:', err.message);
                return db.close();
            }

            if (row) {
                console.log(`Admin user '${username}' already exists in the database. No action needed.`);
                return db.close();
            }

            // 2. Hash the password with a "salt" for extra security
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

            // 3. Inject the hashed credentials into the database as an ADMIN
            db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')`, [username, hashedPassword], function(err) {
                if (err) {
                    console.error('Failed to insert user:', err.message);
                } else {
                    console.log(`Success! Admin user '${username}' has been securely seeded into the database.`);
                }
                db.close();
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        db.close();
    }
};

// Execute the function
seedAdmin();