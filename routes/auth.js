const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authCtrl = require('../controllers/authController');

router.post('/login', authCtrl.login);
router.post('/logout', authCtrl.logout);

router.post('/register', [body('username').isLength({ min: 3 }), body('password').isLength({ min: 6 })], authCtrl.register);

module.exports = router;
