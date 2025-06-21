const express = require('express');
const rutaPrincipal = require('./RutaPrincipal/principal.js');
const contacto = require('./contacto/contacto.js');


const app = express();

app.get('/', rutaPrincipal);
app.post('/api/contacto', contacto);


module.exports = app;
