import express from 'express';
const app = express(); //Servidor
import routes from './app/routes/routes.js';
import middlewares from './app/middleware/middleware.js';
import cuentaRoutes from './app/routes/cuenta.routes.js';
import usuariosRoutes from './app/routes/leads.routes.js';
import cookieParser from 'cookie-parser';

app.use(middlewares);
app.use(cookieParser())
app.use(routes);
app.use(cuentaRoutes);
app.use(usuariosRoutes);

export default app;

