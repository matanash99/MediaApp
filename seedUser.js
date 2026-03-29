const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt'); // Assuming you use bcrypt for hashing!
const path = require('path');

// Point this to where your fresh database lives on the new PC
const dbPath = path.join(__dirname, 'src', 'models', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

async function createAccount(username, plainTextPassword) {
    console.log(`Generating secure hash for ${username}...`);
    
    // Hash the password so even you don't store your friends' raw passwords
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;

    db.run(query, [username, hashedPassword], function(err) {
        if (err) {
            console.error("❌ Error adding user:", err.message);
        } else {
            console.log(`✅ Success! User '${username}' added securely.`);
        }
        db.close(); // Close the database connection
    });
}

// ---- ADD YOUR FRIENDS HERE ----
// Change these values, save the file, and run it in the terminal
createAccount('roni', 'ronirogani1!');