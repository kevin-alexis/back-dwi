const mysql = require('mysql');
const credentials = require('../../config/MySQL/index');
const express = require('express');
const router = express.Router();

router.post('/api/contacto', (req, res) => {
  const { nombre, correo, telefono, mensaje } = req.body

  if (!nombre || !correo || !telefono || !mensaje) {
    return res.status(400).json({ mensaje: 'Faltan campos requeridos.' })
  }

  const values = [nombre, correo, telefono, mensaje]
  const connection = mysql.createConnection(credentials)

  connection.query(
    `
    INSERT INTO contacto (nombre, correo, telefono, mensaje) 
    VALUES (?, ?, ?, ?)
  `,
    values,
    (err, result) => {
      if (err) {
        console.error('Error al insertar en la base de datos:', err)
        return res.status(500).json({ mensaje: 'Error interno del servidor' })
      }

      console.log('Contacto guardado con ID:', result.insertId)

      return res.status(200).json({
        mensaje: 'Mensaje enviado correctamente',
        id: result.insertId,
      })
    }
  )

  connection.end()
})


module.exports = router;