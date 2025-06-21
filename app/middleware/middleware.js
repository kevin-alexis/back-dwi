const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware para analzar el cuerpo de la solicitud en formato JSON y lo convierte en un objeto JavaScript
app.use(bodyParser.json());

// Middleware que habilitar CORS (Cross-Origin Resource Sharing) para todas las rutas
app.use(cors());



module.exports = app;
