import Database from 'better-sqlite3';
import 'dotenv/config';

// Connect to SQLite database, defaulting to dev.db if no environment variable is set
const db = new Database(process.env.DATABASE_URL || './dev.db');

// Simple test table for comics
// TO DO: Add comic data for test
db.exec(`
    CREATE TABLE IF NOT EXISTS comics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      thumbnail TEXT,  -- Path or URL to the thumbnail
      author TEXT,
      tags TEXT,        -- Store tags as a comma-separated string
      is_public INTEGER DEFAULT 1,  -- 1 for public, 0 for private
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

// Check if the comic already exists
const comicExists = db.prepare(`
  SELECT * FROM comics WHERE title = ? AND author = ?
`).get('Test Comic', 'Test Author');

if (!comicExists) {
  // If the comic does not exist, insert it
  db.exec(`
    INSERT INTO comics (title, description, thumbnail, author, tags, is_public)
    VALUES ('Test Comic', 'This is a test webcomic', '/uploads/tg.jpeg', 'Test Author', 'test,webcomic', 1)
  `);
} else {
  console.log('Comic already exists, skipping insert.');
}

// User table
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,  -- Store hashed passwords
      role TEXT DEFAULT 'user',  -- 'admin' or 'user'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

export default db;
