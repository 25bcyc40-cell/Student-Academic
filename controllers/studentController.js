const studentModel = require('../models/studentModel');
const markModel = require('../models/markModel');

function listStudents(req, res) {
  try {
    const students = studentModel.getAllStudents();
    res.json(students);
  } catch (err) {
    console.error('List students error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

function createStudent(req, res) {
  try {
    const id = studentModel.createStudent(req.body);
    res.json({ student_id: id });
  } catch (err) {
    console.error('Create student error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

function getStudent(req, res) {
  try {
    const student = studentModel.getStudentById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Not found' });
    const marks = markModel.getMarksByStudent(req.params.id);
    res.json({ student, marks });
  } catch (err) {
    console.error('Get student error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

function updateStudent(req, res) {
  try {
    studentModel.updateStudent(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error('Update student error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

function deleteStudent(req, res) {
  try {
    studentModel.deleteStudent(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete student error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { listStudents, createStudent, getStudent, updateStudent, deleteStudent };
