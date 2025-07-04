import pool from "../../config/MySQL/database.js";
import crypto from "crypto"; // Librería para generar tokens aleatorios
import bcrypt from "bcrypt"; // Librería para encriptar contraseñas

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

export const agregarUsuario = async (req, res) => {

   try{

    const { nombre, correoElectronico, contraseña, idTipoUsuarioId } = req.body;

    pool.query("SELECT correoElectronico FROM usuarios WHERE correoElectronico = ?",[correoElectronico], async (err, result) => {
      console.log(result);
      if(result.length > 0) {
        return res.status(400).send("El correo electrónico ya está registrado")
      }else{
        const hashedPassword = await hashPassword(contraseña);
        const token = generateToken();
        const result = await pool.query(
          "INSERT INTO usuarios(nombre, correoElectronico, contraseña, token, idTipoUsuarioId) VALUES (?, ?, ?, ?, ?)",
          [nombre, correoElectronico, hashedPassword, token, idTipoUsuarioId]
        );
        console.log(result);
        res.send({
          "usuario": "Usuario creado"
        });
      } 

    });

  } catch (error) {
    console.log(error);
    res.satus(500).send("Error al crear usuario");
  }
};

export const agregarUsuarioGoogle = async (req, res) => {
  try {
    const { nombre, correoElectronico, token, idTipoUsuarioId } = req.body;
    const result = await pool.query(
      "INSERT INTO usuariosGoogle(nombre, correoElectronico, token, idTipoUsuarioId) VALUES (?, ?, ?, ?)",
      [nombre, correoElectronico, token, idTipoUsuarioId]
    );
    console.log(result);
    res.send("Usuario creado");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al crear usuario");
  }

}


export const obtenerUsuarios = (req, res) => {
  pool.query(`SELECT * FROM usuarios`, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (result.length > 0) {
        res.status(200).send(result);
      } else {
        res.status(400).send("Usuarios no existentes");
      }
    }
  });
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { idUsuario, nombre, correoElectronico, contraseña, idTipoUsuarioId } = req.body;
    pool.query('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuario], async (err, result) =>{
      if (result.length === 0) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }  
      const contraseñaCoincidePlano = await checkPassword(contraseña, result[0].contraseña);
      const contraseñaCoincideHash = (contraseña === result[0].contraseña);
      let hashedPassword = result[0].contraseña;
  
      if (!contraseñaCoincidePlano && !contraseñaCoincideHash) {
        hashedPassword = await hashPassword(contraseña);
      }
  
      await pool.query(
        `UPDATE usuarios SET nombre = ?, correoElectronico = ?, contraseña = ?, idTipoUsuarioId = ? WHERE idUsuario = ?`,
        [nombre, correoElectronico, hashedPassword, idTipoUsuarioId, idUsuario]
      );
  
      res.json({ message: "Usuario modificado" });
    });
    
    
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const eliminarUsuario = (req, res) => {
  const { idUsuario } = req.body;
  pool.query(
    `DELETE FROM usuarios WHERE idUsuario = ?;`,
    [idUsuario],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (result) {
          res.status(200).send("Usuario eliminado con exito");
        } else {
          res.status(400).send("Usuario no existente");
        }
      }
    }
  );
};

export const obtenerCantidadUsuarios = (req, res) => {
  pool.query(
    `SELECT * FROM usuarios;`,
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (result) {
          res.status(200).json(result.length);
        } else {
          res.status(400).send("Usuario no existente");
        }
      }
    }
  );
};

export const obtenerCantidadUsuariosGoogle = (req, res) => {
  pool.query(
    `SELECT * FROM usuariosGoogle;`,
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (result) {
          res.status(200).json(result.length);
        } else {
          res.status(400).send("Usuario no existente");
        }
      }
    }
  );
};