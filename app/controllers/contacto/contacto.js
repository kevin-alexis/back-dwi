import express from 'express';
import mysql from 'mysql2/promise';
import credentials from '../../config/MySQL/config.js';
import { object, string } from 'yup';
import fetch from 'node-fetch';

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
  recaptcha_token: string().required('Token de reCAPTCHA es obligatorio'), 
});

router.post('/api/contacto', async (req, res) => {
  try {
    const { nombre, correo, telefono, mensaje, recaptcha_token } = await contactoSchema.validate(req.body, {
      abortEarly: false,
    });

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha_token}`;
    const response = await fetch(verificationUrl, { method: 'POST' });

    const data = await response.json();
    console.log("data:", data);

    if (data.success == false) {
      return res.status(400).json({ mensaje: 'Error en la verificación de reCAPTCHA.' });
    }

    const connection = await mysql.createConnection(credentials);
    const values = [nombre, correo, telefono, mensaje, 'Pendiente'];

    const [result] = await connection.execute(
      `INSERT INTO contactos (nombre, correo, telefono, mensaje, estatus) VALUES (?, ?, ?, ?, ?)`,
      values
    );

    await connection.end();

    console.log('Contacto guardado con ID:', result.insertId);
    return res.status(200).json({
      mensaje: 'Mensaje enviado correctamente.',
      id: result.insertId,
    });

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


export default router;
