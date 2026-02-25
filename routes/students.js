const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studentController');
const { ensureAuth } = require('../utils/auth');

router.get('/', ensureAuth, ctrl.listStudents);
router.post('/', ensureAuth, ctrl.createStudent);
router.get('/:id', ensureAuth, ctrl.getStudent);
router.put('/:id', ensureAuth, ctrl.updateStudent);
router.delete('/:id', ensureAuth, ctrl.deleteStudent);

module.exports = router;
