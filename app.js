const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

const app = express();
app.use(bodyParser.json());

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
