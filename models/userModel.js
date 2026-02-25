const db = require('../config/db');

function findByUsername(username) {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
}

function createUser(username, passwordHash, role = 'admin') {
  const result = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(username, passwordHash, role);
  return result.lastInsertRowid;
}

module.exports = { findByUsername, createUser };
