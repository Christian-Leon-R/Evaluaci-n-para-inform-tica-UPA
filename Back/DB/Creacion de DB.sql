-- Crear la base de datos
CREATE DATABASE Christian_Alejandro_León_Rabanales;

-- Usar la base de datos
USE Christian_Alejandro_León_Rabanales;

-- Crear la tabla EstadoUsuario
CREATE TABLE EstadoUsuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(50) NOT NULL,
    clave VARCHAR(20) NOT NULL
);

-- Crear la tabla usuario
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    EstadoUsuarioId INT NOT NULL,
    FOREIGN KEY (EstadoUsuarioId) REFERENCES EstadoUsuario(id)
);

-- Crear la tabla Punteo_Usuario
CREATE TABLE Punteo_Usuario (
    Id_Punteo INT AUTO_INCREMENT PRIMARY KEY,
    Id_Usuario INT NOT NULL,
    Punteo_Usuario INT NOT NULL DEFAULT,
    Fecha_Ingreso  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Id_Usuario) REFERENCES usuario(id)

-- Insertar los valores iniciales en EstadoUsuario
INSERT INTO EstadoUsuario (titulo, clave)
VALUES
('Activo', 'activo'),
('Baja Permanente', 'baja');

