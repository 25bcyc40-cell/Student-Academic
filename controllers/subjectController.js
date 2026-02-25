const subjectModel = require('../models/subjectModel');
const semesterModel = require('../models/semesterModel');

function listSubjects(req, res) {
  try {
    const subjects = subjectModel.getAllSubjects();
    res.json(subjects);
  } catch (err) {
    console.error('List subjects error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

function createSubject(req, res) {
  try {
    const id = subjectModel.createSubject(req.body);
    res.json({ subject_id: id });
  } catch (err) {
    console.error('Create subject error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

function listSemesters(req, res) {
  try {
    const sems = semesterModel.getAllSemesters();
    res.json(sems);
  } catch (err) {
    console.error('List semesters error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { listSubjects, createSubject, listSemesters };
