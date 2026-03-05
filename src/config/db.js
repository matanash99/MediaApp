const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Set the path to save the SQLite file inside our models folder
const dbPath = path.join(__dirname, '../models/database.sqlite');

// Initialize the database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
        return;
    }
    console.log('Connected to the SQLite database.');

    // 1. Create Users Table (For your Admin account)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`);

    // 2. Create Videos Table
    db.run(`CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        video_path TEXT NOT NULL,
        subtitle_path TEXT,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 3. Create Comments Table
    db.run(`CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id INTEGER NOT NULL,
        guest_name TEXT NOT NULL,
        comment_text TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
    )`);
    
    console.log('Database tables are ready.');
});

module.exports = db;