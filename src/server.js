const express = require('express');
const path = require('path');
const homeRouter = require('./routes/home');
const pullsRouter = require('./routes/pulls');

const app = express();

app.use( '/', homeRouter );
app.use('/pulls', pullsRouter);

module.exports = app;
