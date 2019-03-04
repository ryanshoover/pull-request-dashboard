const express = require('express');
const homeRouter = require('./routes/home');
const pullsRouter = require('./routes/pulls');
const productsRouter = require('./routes/products');

const app = express();

app.use( '/', homeRouter );
app.use('/api/pulls', pullsRouter);
app.use('/api/products', productsRouter);

module.exports = app;
