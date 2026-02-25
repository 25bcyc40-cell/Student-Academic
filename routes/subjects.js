const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/subjectController');
const { ensureAuth } = require('../utils/auth');

router.get('/', ensureAuth, ctrl.listSubjects);
router.post('/', ensureAuth, ctrl.createSubject);
router.get('/semesters', ensureAuth, ctrl.listSemesters);

module.exports = router;
