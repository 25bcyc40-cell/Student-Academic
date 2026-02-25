const db = require('../config/db');

function addMark(data) {
  const { student_id, subject_id, semester_id, marks_obtained, grade } = data;
  const result = db.prepare('INSERT INTO marks (student_id, subject_id, semester_id, marks_obtained, grade) VALUES (?, ?, ?, ?, ?)').run(student_id, subject_id, semester_id, marks_obtained, grade);
  return result.lastInsertRowid;
}

function getMarksByStudent(student_id) {
  return db.prepare(`SELECT m.*, sub.subject_name, sub.credits, sem.semester_name FROM marks m
    JOIN subjects sub ON m.subject_id = sub.subject_id
    JOIN semesters sem ON m.semester_id = sem.semester_id
    WHERE m.student_id = ? ORDER BY sem.semester_id`).all(student_id);
}

function getMarksBySemester(semester_id) {
  return db.prepare('SELECT * FROM marks WHERE semester_id = ?').all(semester_id);
}

function getAllMarks() {
  return db.prepare(`SELECT m.*, s.name as student_name, sub.subject_name, sem.semester_name FROM marks m
    JOIN students s ON m.student_id = s.student_id
    JOIN subjects sub ON m.subject_id = sub.subject_id
    JOIN semesters sem ON m.semester_id = sem.semester_id`).all();
}

module.exports = { addMark, getMarksByStudent, getMarksBySemester, getAllMarks };
