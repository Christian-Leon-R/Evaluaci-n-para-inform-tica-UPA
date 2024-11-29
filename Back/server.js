const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./config/db');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/guardar_usuario', async (req, res) => {
    const { nombre, fecha, telefono, correo } = req.body;

    const validarNombre = (nombre) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre.trim());
    const validarFecha = (fecha) => /^\d{2}-\d{2}-\d{4}$/.test(fecha) && !isNaN(new Date(fecha.split('-').reverse().join('-')));
    const validarTelefono = (telefono) => /^\d{8,15}$/.test(telefono);
    const validarCorreo = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    if (!nombre || !fecha || !telefono || !correo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    if (!validarNombre(nombre)) {
        return res.status(400).json({ error: 'El nombre solo puede contener letras y espacios.' });
    }

    if (!validarFecha(fecha)) {
        return res.status(400).json({ error: 'La fecha debe tener el formato dd-mm-YYYY.' });
    }

    if (!validarTelefono(telefono)) {
        return res.status(400).json({ error: 'El teléfono solo puede contener entre 8 y 15 números.' });
    }

    if (!validarCorreo(correo)) {
        return res.status(400).json({ error: 'El correo debe tener un formato válido (ej. ejemplo@dominio.com).' });
    }

    const calcularEdad = (fechaNacimiento) => {
        const [dia, mes, anio] = fechaNacimiento.split('-').map(Number);
        const fechaActual = new Date();
        const fechaNacimientoDate = new Date(anio, mes - 1, dia);

        let edad = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear();
        if (
            fechaActual.getMonth() < mes - 1 ||
            (fechaActual.getMonth() === mes - 1 && fechaActual.getDate() < dia)
        ) {
            edad--;
        }

        return edad;
    };

    const edad = calcularEdad(fecha);
    if (edad < 18) {
        return res.status(400).json({ error: 'El usuario debe ser mayor de edad.' });
    }

    try {
        const [estado] = await pool.query('SELECT id FROM EstadoUsuario WHERE clave = "activo"');
        if (estado.length === 0) {
            return res.status(500).json({ error: 'No se encontró el estado "activo" en la base de datos.' });
        }

        const estadoId = estado[0].id;

        const [resultado] = await pool.query(
            'INSERT INTO usuario (nombre, fecha, telefono, correo, EstadoUsuarioId) VALUES (?, ?, ?, ?, ?)',
            [nombre, fecha.split('-').reverse().join('-'), telefono, correo, estadoId]
        );

        res.status(201).json({ message: 'Usuario almacenado con éxito.', id: resultado.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el usuario en la base de datos.' });
    }
});

app.get('/ejecutar_reporte/:reporte', async (req, res) => {
    const { reporte } = req.params;

    if (!reporte) {
        return res.status(500).json({ error: 'Error inesperado: Código de reporte no proporcionado.' });
    }

    try {
        let data;

        switch (reporte) {
            case 'usuarios_todos':
                data = await obtenerTodosLosUsuarios();
                break;
            case 'usuarios_activos':
                data = await obtenerUsuariosActivos();
                break;
            case 'usuarios_baja':
                data = await obtenerUsuariosEnBaja();
                break;
            default:
                return res.status(500).json({ error: 'Error inesperado: Código de reporte no válido.' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error al ejecutar el reporte:', error);
        res.status(500).json({ error: 'Error inesperado al ejecutar el reporte.' });
    }
});

const obtenerTodosLosUsuarios = async () => {
    const [rows] = await pool.query(
        'SELECT usuario.id, usuario.nombre, usuario.telefono, EstadoUsuario.titulo AS estado FROM usuario INNER JOIN EstadoUsuario ON usuario.EstadoUsuarioId = EstadoUsuario.id'
    );
    return rows;
};

const obtenerUsuariosActivos = async () => {
    const [rows] = await pool.query(
        'SELECT usuario.id, usuario.nombre, usuario.telefono FROM usuario WHERE EstadoUsuarioId = (SELECT id FROM EstadoUsuario WHERE clave = "activo")'
    );
    return rows;
};

const obtenerUsuariosEnBaja = async () => {
    const [rows] = await pool.query(
        'SELECT usuario.id, usuario.nombre, usuario.telefono FROM usuario WHERE EstadoUsuarioId = (SELECT id FROM EstadoUsuario WHERE clave = "baja")'
    );
    return rows;
};

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
