const express = require('express');
const Note = require('../models/note');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();

router.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ message: 'No token provided' });
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(500).send({ message: 'Failed to authenticate token' });
    req.userId = decoded.id;
    next();
  });
});

router.post('/', async (req, res) => {
  try {
    const note = new Note({ ...req.body, userId: req.userId });
    await note.save();
    res.status(201).send(note);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId, trash: false });
    res.send(notes);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/archived', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId, archived: true });
    res.send(notes);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/trash', async (req, res) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const notes = await Note.find({ userId: req.userId, trash: true, updatedAt: { $gte: date } });
    res.send(notes);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true });
    if (!note) return res.status(404).send({ message: 'Note not found' });
    res.send(note);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).send({ message: 'Note not found' });
    res.send({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
