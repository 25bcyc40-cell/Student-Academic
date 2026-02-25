const express = require('express');
const router = express.Router();
const reportCtrl = require('../controllers/reportController');
const { ensureAuth } = require('../utils/auth');

router.get('/student/:id', ensureAuth, reportCtrl.studentReport);

module.exports = router;
