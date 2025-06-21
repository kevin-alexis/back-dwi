const mysql = require('mysql');
const credentials = require('../../config/MySQL/index');
const express = require('express');
const router = express.Router();

// Ruta para obtener usuario y verificar que exista LOGIN
router.post('/api/contacto', (req, res) =>{
    console.log(req)
    const {nombre, correo, telefono, mensaje} = req.body // Acceso a los datos enviados en el cuerpo de la solicitud
    const values = [nombre, correo, telefono, mensaje]
    const connection = mysql.createConnection(credentials)
    connection.query(`
    INSERT INTO contacto (nombre, correo, telefono, mensaje) VALUES  
    (?, ?, ?, ?);
`, values, (err, result) =>{
        console.log(result)
        // if(err){
        //     res.status(500).send(err)
        // } else{
        //     if(result.length > 0){
        //         res.status(200).send({
        //             "id": result[0].id_usuario,
        //             "usuario": result[0].usuario,
        //             "email": result[0].email,
        //             "type": result[0].nombre_tipo,
        //         })
        //     }else{
        //         res.status(400).send('Usuario no existente')
        //     }
        // }
    })
    connection.end()
})

module.exports = router;