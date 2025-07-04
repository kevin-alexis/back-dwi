import express from 'express';
const app = express(); //Servidor
import routes from './app/routes/routes.js';
import middlewares from './app/middleware/middleware.js';
import cuentaRoutes from './app/routes/cuenta.routes.js';
import usuariosRoutes from './app/routes/usuarios.routes.js';

app.use(middlewares);
app.use(routes);
app.use(cuentaRoutes);
app.use(usuariosRoutes);

export default app;

