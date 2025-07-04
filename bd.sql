CREATE DATABASE dwi;

USE dwi;

CREATE TABLE contacto (
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    estatus ENUM('Pendiente', 'Contactado', 'Rechazado')
);


select * from contacto;