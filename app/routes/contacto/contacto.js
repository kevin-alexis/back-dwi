const express = require('express');
const mysql = require('mysql');
const credentials = require('../../config/MySQL/index');
const { object, string } = require('yup');

const router = express.Router();

const contactoSchema = object({
  nombre: string()
    .trim()
    .required('El nombre es obligatorio'),
  correo: string()
    .trim()
    .email('El correo electrónico no es válido')
    .required('El correo es obligatorio'),
  telefono: string()
    .trim()
    .min(7, 'El número de teléfono no es válido')
    .max(15, 'El número de teléfono no es válido')
    .required('El teléfono es obligatorio'),
  mensaje: string()
    .trim()
    .required('El mensaje es obligatorio'),
});

router.post('/api/contacto', async (req, res) => {
  try {
    const { nombre, correo, telefono, mensaje } = await contactoSchema.validate(req.body, {
      abortEarly: false, 
    });

    const values = [nombre, correo, telefono, mensaje];
    const connection = mysql.createConnection(credentials);

    connection.query(
      `INSERT INTO contacto (nombre, correo, telefono, mensaje) VALUES (?, ?, ?, ?)`,
      values,
      (err, result) => {
        connection.end();

        if (err) {
          console.error('Error al insertar en la base de datos:', err);
          return res.status(500).json({ mensaje: 'Error interno del servidor.' });
        }

        console.log('Contacto guardado con ID:', result.insertId);
        return res.status(200).json({
          mensaje: 'Mensaje enviado correctamente.',
          id: result.insertId,
        });
      }
    );
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        mensaje: 'Errores de validación.',
        errores: error.errors,
      });
    }

    console.error('Error inesperado:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

module.exports = router;
