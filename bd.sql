CREATE DATABASE dwi;

USE dwi;

CREATE TABLE contactos (
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    estatus ENUM('Pendiente', 'Contactado', 'Rechazado')
);

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correoElectronico VARCHAR(255) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    token TEXT
);
