import pool from '../../config/MySQL/database.js';
import bcrypt from "bcrypt"; // Librería para encriptar contraseñas
import crypto from "crypto"; // Librería para generar tokens aleatorios
import transporter from '../../config/nodemailer/mailer.js';
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

// Función para generar un token aleatorio
function generateToken() {
    return crypto.randomBytes(32).toString("hex"); // Genera un token hexadecimal de 128 caracteres (64 bytes)
}

// Iniciar Sesión
// Secret key for signing the token
const secretKey = 'your-secret-key'; // Reemplázalo con tu clave secreta segura para producción

export const iniciarSesion = (req, res) => {  
    const { correoElectronico, contraseña } = req.body;
    const plainPassword = contraseña;
    pool.query(`SELECT usuarios.idUsuario, usuarios.nombre, usuarios.correoElectronico, usuarios.contraseña, usuarios.token, tipoUsuarios.rol
    FROM usuarios
    INNER JOIN tipoUsuarios ON usuarios.idTipoUsuarioId = tipoUsuarios.idTipoUsuario
    WHERE usuarios.correoElectronico = ?`, [correoElectronico], async (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.length > 0) {
                const hashedPassword = result[0].contraseña;
                try {
                    const match = await checkPassword(plainPassword, hashedPassword);
                    if (match) {
                    // Generar un token JWT
                    const token = jwt.sign({ id: result[0].idUsuario, correoElectronico: result[0].correoElectronico, rol: result[0].rol }, secretKey); 
                    // Devolver el token y la información del usuario en la respuesta
                    res.status(200).json({ token, user: result });
                    } else {
                        res.status(400).send('Contraseña incorrecta');
                    }
                } catch (error) {
                    console.error("Error al verificar la contraseña:", error);
                    res.status(500).send('Error interno del servidor');
                }
            } else {
                res.status(400).send({"error": "Usuario no existente"});
            }
        }
    });
};


export const iniciarSesionGoogle = (req, res) => {
    const { correoElectronico, token } = req.body;
    pool.query(
        `SELECT usuariosGoogle.idUsuario, usuariosGoogle.nombre, usuariosGoogle.correoElectronico, usuariosGoogle.token, tipoUsuarios.rol
        FROM usuariosGoogle
        INNER JOIN tipoUsuarios ON usuariosGoogle.idTipoUsuarioId = tipoUsuarios.idTipoUsuario
        WHERE usuariosGoogle.correoElectronico = ? AND usuariosGoogle.token = ?`,
        [correoElectronico, token],
        async (err, result) => {
            if (err) {
                // Manejar errores de consulta SQL y enviar una respuesta detallada
                res.status(500).send('Error interno del servidor: ' + err.message);
            } else {
                if (result.length > 0) {
                    try {
                        // Generar un token JWT
                        const token = jwt.sign({
                            id: result[0].idUsuario,
                            correoElectronico: result[0].correoElectronico,
                            rol: result[0].rol
                        }, secretKey);

                        // Devolver el token y la información del usuario en la respuesta
                        res.status(200).json({ token, user: result[0] });
                    } catch (error) {
                        console.error("Error al generar el token:", error);
                        // Manejar errores durante la generación del token y enviar una respuesta detallada
                        res.status(500).send('Error interno del servidor: ' + error.message);
                    }
                } else {
                    // Si no se encuentra un usuario con el correo y el token proporcionados
                    res.status(400).send('Usuario no existente');
                }
            }
        }
    );
};



// ! RECUPERAR CONTRASEÑA - SE LE  ENVIA POR CORREO UN LINK CON UN TOKEN PARA CAMBIAR SU CONTRA

export const recuperarCuenta = (req, res) => {
    const correoElectronico = req.body.correoElectronico;
    const url = 'http://localhost:3000/cambiar-password?token='
    pool.query(`SELECT * FROM usuarios WHERE correoElectronico = ?`,[correoElectronico], (err, result) =>{
        if(err){
            res.status(500).send(err)
        }else{
            if(result.length > 0){
                const token = result[0].token;
                const idUsuario = result[0].idUsuario;
                const nuevoToken = generateToken();
                pool.query(`UPDATE usuarios SET token = ? WHERE idUsuario = ? AND token = ?`,[nuevoToken, idUsuario, token])
                transporter.sendMail({
                    from: '"Olvide mi contraseña" <globainvestmentcentereducation@gmail.com>', // sender address
                    to: correoElectronico, // list of receivers
                    subject: "Olvide mi contraseña", // Subject line
                  //   text: "Hello world?", // plain text body
                    html: `
                    <b>Por favor da click en el siguiente link, o pegalo en tu navegador para completar el proceso</b>
                    <a href="${url+nuevoToken+'&&idUsuario='+idUsuario}">${url+nuevoToken+'&&idUsuario='+idUsuario}</a>
                    `, // html body
              })
              res.status(200).send("Correo enviado");
            }else{
                res.status(400).send('Correo no existente')
            }
        }
    })
}

// * CAMBIAR CONTRASEÑA

export const cambiarContraseña = async (req, res) => {
    const token = req.query.token;
    const idUsuario = req.query.idUsuario;
    const contraseña = req.body.contraseña;
    const hashedPassword = await hashPassword(contraseña);
    const nuevoToken = generateToken();

    pool.query(`UPDATE usuarios SET contraseña = ?, token = ? WHERE idUsuario = ? AND token = ?`,[hashedPassword, nuevoToken, idUsuario, token], (err, result) =>{
        if(err){
            res.status(500).send(err)
        }else{
            if(result.affectedRows > 0){
                res.status(200).send("Contraseña cambiada exitosamente");
            }else{
                console.log(token, idUsuario, contraseña);
                res.status(400).send('Usuario no existente')
            }
        }
    })

}