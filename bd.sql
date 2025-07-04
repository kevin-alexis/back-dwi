CREATE DATABASE dwi;

USE dwi;

CREATE TABLE contacto (
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tipoUsuarios (
    idTipoUsuario INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correoElectronico VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    token TEXT,
    idTipoUsuarioId INT,
	idPlataformaId INT,
    FOREIGN KEY (idTipoUsuarioId) REFERENCES tipoUsuarios(idTipoUsuario)
);
