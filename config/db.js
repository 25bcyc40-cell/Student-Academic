const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Create database file in project root
const dbPath = path.join(__dirname, '..', 'student_analytics.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema if database is empty
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
if (tables.length === 0) {
  console.log('Initializing database schema...');
  const schema = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf-8');
  db.exec(schema);
  console.log('✓ Database schema created');
}

module.exports = db;

