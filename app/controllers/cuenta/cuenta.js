import pool from '../../config/MySQL/database.js';
import bcrypt from "bcrypt"; // Librería para encriptar contraseñas
import crypto from "crypto"; // Librería para generar tokens aleatorios
import jwt from 'jsonwebtoken';

// Función para hashear la contraseña con salt y key stretching
async function hashPassword(password) {
    const saltRounds = 12;
    // ? Número de rondas de key stretching - hacerlo lento, contrataca el ataques de fuerza bruta y diccionario. 
    // ? Para hacer que estos ataques sean menos efectivos, podemos hacer que el proceso de hash sea más lento, 
    // ? haciendo que la función de hash incluya un número alto de iteraciones internas. 
    // ? Esta técnica es conocida como Key stretching.
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

// Función para verificar la contraseña
async function checkPassword(inputPassword, hashedPassword) {
    try {
        const passwordMatch = await bcrypt.compare(inputPassword, hashedPassword);
        return passwordMatch;
    } catch (error) {
        throw error;
    }
}

export const crearUsuario = async (req, res) => {
    try {
        const correoElectronico = 'root@admin.com'
        const contrasena = 'admin_1234!'
        const nombre = 'administrador'

        // Verificar si ya existe el usuario
        const [usuariosExistentes] = await pool.query(
            `SELECT id FROM usuarios WHERE correoElectronico = ?`,
            [correoElectronico]
        )

        if (usuariosExistentes.length > 0) {
            return res.status(400).json({ error: 'El usuario ya existe' })
        }

        const contrasenaHasheada = await bcrypt.hash(contrasena, 10)

        const [result] = await pool.query(
            `INSERT INTO usuarios (nombre, correoElectronico, contrasena) VALUES (?, ?, ?)`,
            [nombre, correoElectronico, contrasenaHasheada]
        )

        res.status(200).json({
            mensaje: 'Usuario creado exitosamente',
            insertId: result.insertId
        })
    } catch (error) {
        console.error('Error al crear usuario:', error)
        res.status(500).json({ error: 'Error interno al crear usuario' })
    }
}

export const iniciarSesion = async (req, res) => {
    try {
        const { correoElectronico, contrasena } = req.body;

        const [usuarios] = await pool.query(`SELECT id, nombre, correoElectronico, contrasena, token FROM usuarios 
        WHERE usuarios.correoElectronico = ?`, [correoElectronico]);

        if (usuarios.length > 0) {
            const hashedPassword = usuarios[0].contrasena;
            const match = await checkPassword(contrasena, hashedPassword);

            if (match) {
                // Generar un token JWT
                const token = jwt.sign({ id: usuarios[0].id, correoElectronico: usuarios[0].correoElectronico }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
                // Devolver el token y la información del usuario en la respuesta
                // Enviar cookie (httpOnly para que no se acceda con JS)
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Lax',
                    maxAge: 2 * 60 * 60 * 1000, // 2 horas
                    path: '/'
                })

                res.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario: { id: usuarios[0].id, nombre: usuarios[0].nombre } })

            } else {
                res.status(400).send('Contraseña incorrecta');
            }

        } else {
            return res.status(404).json({ error: 'Credenciales incorrectas' })
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
};

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/'
  })
  res.json({ mensaje: 'Sesión cerrada correctamente' })
}
