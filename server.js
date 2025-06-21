const app = require('./app.js');
const port = 8080;

// Iniciar el servidor, escucha en el puerto 8080
app.listen(port, () => {
    console.log('Servidor iniciado en el puerto 8080');
})
