const markModel = require('../models/markModel');
const subjectModel = require('../models/subjectModel');

function gradeFromMarks(marks) {
  if (marks >= 90) return 'O';
  if (marks >= 80) return 'A+';
  if (marks >= 70) return 'A';
  if (marks >= 60) return 'B+';
  if (marks >= 50) return 'B';
  return 'C';
}

function addMark(req, res) {
  try {
    const data = req.body;
    data.grade = gradeFromMarks(Number(data.marks_obtained));
    const id = markModel.addMark(data);
    res.json({ mark_id: id });
  } catch (err) {
    console.error('Add mark error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

function listAllMarks(req, res) {
  try {
    const rows = markModel.getAllMarks();
    res.json(rows);
  } catch (err) {
    console.error('List marks error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { addMark, listAllMarks };
