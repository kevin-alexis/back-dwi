const express = require('express');
const app = express(); //Servidor
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

//Para aplicar un middleware a todas las rutas de una aplicación Express, se utiliza el método app.use()

// Middleware para analzar el cuerpo de la solicitud en formato JSON y lo convierte en un objeto JavaScript
app.use(bodyParser.json());

// Middleware que habilitar CORS (Cross-Origin Resource Sharing) para todas las rutas
app.use(cors());

//Credenciales de MySQL
const credentials = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'piercings_paradise',
    port: 3307
}

// Ruta principal
app.get('/', (req, res) =>{
    res.send('Hola mundo!');
})

// Ruta para obtener usuario y verificar que exista LOGIN
// app.post('/api/login', (req, res) =>{
//     const {username, password} = req.body // Acceso a los datos enviados en el cuerpo de la solicitud
//     const values = [username, password]
//     const connection = mysql.createConnection(credentials)
//     connection.query("SELECT Id_usuario, usuarios.nombre AS usuario, email, tipos_usuarios.nombre AS tipo FROM usuarios INNER JOIN tipos_usuarios ON usuarios.id_usuario = tipos_usuarios.id_tipo WHERE email = ? AND contrasena = ?", values, (err, result) =>{
//         if(err){
//             res.status(500).send(err)
//         } else{
//             if(result.length > 0){
//                 res.status(200).send({
//                     "id": result[0].id_usuario,
//                     "usuario": result[0].usuario,
//                     "email": result[0].email,
//                     "type": result[0].tipo,
//                 })
//             }else{
//                 res.status(400).send('Usuario no existente')
//             }
//         }
//     })
//     connection.end()
// })

// Iniciar el servidor, escucha en el puerto 8080
app.listen(8080, () => {
    console.log('Servidor iniciado en el puerto 8080');
})