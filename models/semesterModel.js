const db = require('../config/db');

function getAllSemesters() {
  return db.prepare('SELECT * FROM semesters ORDER BY semester_id').all();
}

function createSemester(name) {
  const result = db.prepare('INSERT INTO semesters (semester_name) VALUES (?)').run(name);
  return result.lastInsertRowid;
}

module.exports = { getAllSemesters, createSemester };
