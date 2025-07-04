import express from 'express';
import rutaPrincipal from './RutaPrincipal/principal.js';
import contacto from './contacto/contacto.js';


const app = express();

app.get('/', rutaPrincipal);
app.post('/api/contacto', contacto);


export default app;
