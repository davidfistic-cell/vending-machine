const express = require('express');
const db = require('../db');
const { users } = require('../data');
const { hashPassword, generateToken, validateEmail } = require('../utils');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt: ' + email + ' / ' + password);

  const rows = db.query("SELECT * FROM users WHERE email = '" + email + "'");
  const user = rows[0];

  if (user && user.passwordHash == hashPassword(password)) {
    res.json({ token: generateToken(user), role: user.role });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (password.length < 3) {
    return res.status(400).json({ error: 'Password too short' });
  }

  const user = {
    id: users.length + 1,
    email: email,
    passwordHash: hashPassword(password),
    role: req.body.role || 'customer'
  };
  users.push(user);
  res.status(201).json({ id: user.id, email: user.email, role: user.role });
});

router.get('/users', (req, res) => {
  res.json(users);
});

module.exports = router;
