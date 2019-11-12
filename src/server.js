const express = require('express');
const homeRouter = require('./routes/home');
const pullsRouter = require('./routes/pulls');
const dependenciesRouter = require('./routes/dependencies');

const app = express();

app.use( '/', homeRouter );
app.use( '/api/pulls', pullsRouter );
app.use( '/api/dependencies', dependenciesRouter );

module.exports = app;
