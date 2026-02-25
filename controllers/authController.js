const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');

function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = userModel.findByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    req.session.user = { id: user.user_id, username: user.username, role: user.role };
    res.json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

function logout(req, res) {
  req.session.destroy(() => res.json({ success: true }));
}

function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  try {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const id = userModel.createUser(username, hash);
    res.json({ user_id: id });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { login, logout, register };
