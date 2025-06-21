const express = require('express');
const app = express(); //Servidor
const routes = require('./app/routes/routes.js');
const middlewares = require('./app/middleware/middleware.js');

app.use(middlewares);
app.use(routes);

module.exports = app;

