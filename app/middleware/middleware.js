import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// Middleware para analzar el cuerpo de la solicitud en formato JSON y lo convierte en un objeto JavaScript
app.use(bodyParser.json());

// Middleware que habilitar CORS (Cross-Origin Resource Sharing) para todas las rutas
app.use(cors({
    origin: process.env.VITE_CLIENT_URL,
    credentials: true
}));



export default app;
