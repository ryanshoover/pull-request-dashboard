var express = require('express');
var pullsRouter = require('./routes/pulls');

var app = express();

// view engine setup
app.use('/pulls', pullsRouter);

module.exports = app;
