const db = require('../config/db');

function createStudent(data) {
  const { name, email, course } = data;
  const result = db.prepare('INSERT INTO students (name, email, course) VALUES (?, ?, ?)').run(name, email, course);
  return result.lastInsertRowid;
}

function getAllStudents() {
  return db.prepare('SELECT * FROM students ORDER BY student_id DESC').all();
}

function getStudentById(id) {
  return db.prepare('SELECT * FROM students WHERE student_id = ?').get(id);
}

function updateStudent(id, data) {
  const { name, email, course } = data;
  db.prepare('UPDATE students SET name=?, email=?, course=? WHERE student_id=?').run(name, email, course, id);
}

function deleteStudent(id) {
  db.prepare('DELETE FROM students WHERE student_id = ?').run(id);
}

module.exports = { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent };
