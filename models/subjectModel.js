const db = require('../config/db');

function createSubject(data) {
  const { subject_name, credits, semester_id } = data;
  const result = db.prepare('INSERT INTO subjects (subject_name, credits, semester_id) VALUES (?, ?, ?)').run(subject_name, credits, semester_id);
  return result.lastInsertRowid;
}

function getAllSubjects() {
  return db.prepare(`SELECT s.*, sem.semester_name FROM subjects s LEFT JOIN semesters sem ON s.semester_id = sem.semester_id ORDER BY s.subject_id DESC`).all();
}

function getSubjectById(id) {
  return db.prepare('SELECT * FROM subjects WHERE subject_id = ?').get(id);
}

module.exports = { createSubject, getAllSubjects, getSubjectById };
