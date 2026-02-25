const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/markController');
const { ensureAuth } = require('../utils/auth');

router.get('/', ensureAuth, ctrl.listAllMarks);
router.post('/', ensureAuth, ctrl.addMark);

module.exports = router;
