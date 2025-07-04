import express from 'express';
import contacto from '../controllers/contacto/contacto.js';
import { verificarSesion } from '../controllers/session/sesion.js';


const app = express();

app.get('/', (req, res) => {
  res.send('Hola mundo!');
});

app.post('/api/contacto', contacto);
app.get('/api/verificar-sesion', verificarSesion);


export default app;
