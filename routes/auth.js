const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !user.comparePassword(password)) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: '1h' });
  res.send({ token });
});

module.exports = router;
