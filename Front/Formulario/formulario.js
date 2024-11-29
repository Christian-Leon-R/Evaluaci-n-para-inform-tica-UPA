document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formRegistro");
    const nombreInput = document.getElementById("nombre");
    const fechaNacimientoInput = document.getElementById("fechaNacimiento");
    const telefonoInput = document.getElementById("telefono");
    const correoInput = document.getElementById("correo");
    const edadDisplay = document.getElementById("edad");


    const validarNombre = (nombre) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre.trim());
    const validarFecha = (fecha) => /^\d{2}-\d{2}-\d{4}$/.test(fecha) && !isNaN(new Date(fecha.split("-").reverse().join("-")));
    const validarTelefono = (telefono) => /^\d{8,15}$/.test(telefono);
    const validarCorreo = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);


    const calcularEdad = (fechaNacimiento) => {
        const [dia, mes, anio] = fechaNacimiento.split("-").map(Number);
        const fechaActual = new Date();
        const fechaNacimientoDate = new Date(anio, mes - 1, dia);

        if (isNaN(fechaNacimientoDate)) return 0;

        let edad = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear();
        const mesActual = fechaActual.getMonth();
        const diaActual = fechaActual.getDate();

        if (mesActual < mes - 1 || (mesActual === mes - 1 && diaActual < dia)) {
            edad--;
        }

        return edad >= 0 ? edad : 0;
    };


    const mostrarError = (input, mensaje) => {
        const error = input.nextElementSibling;
        error.textContent = mensaje;
        error.style.display = "block";
        input.focus();
    };

    const limpiarErrores = (input) => {
        const error = input.nextElementSibling;
        error.textContent = "";
        error.style.display = "none";
    };

    // Validar formulario al enviar
    form.addEventListener("submit", async (e) => {
        e.preventDefault();


        const nombre = nombreInput.value;
        if (!validarNombre(nombre)) {
            mostrarError(nombreInput, "El nombre solo puede contener letras y espacios.");
            return;
        }
        limpiarErrores(nombreInput);


        const fechaNacimiento = fechaNacimientoInput.value;
        if (!validarFecha(fechaNacimiento)) {
            mostrarError(fechaNacimientoInput, "La fecha debe tener el formato dd-mm-YYYY.");
            return;
        }
        limpiarErrores(fechaNacimientoInput);


        const telefono = telefonoInput.value;
        if (!validarTelefono(telefono)) {
            mostrarError(telefonoInput, "El teléfono solo puede contener entre 8 y 15 números.");
            return;
        }
        limpiarErrores(telefonoInput);


        const correo = correoInput.value;
        if (!validarCorreo(correo)) {
            mostrarError(correoInput, "El correo debe tener un formato válido (ej. ejemplo@dominio.com).");
            return;
        }
        limpiarErrores(correoInput);


        const edad = calcularEdad(fechaNacimiento);
        if (edad < 0) {
            mostrarError(fechaNacimientoInput, "La fecha de nacimiento no puede ser en el futuro.");
            return;
        }
        edadDisplay.textContent = `${edad} años`;


        try {
            const respuesta = await fetch("http://localhost:3000/guardar_usuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre, fechaNacimiento, telefono, correo }),
            });

            if (respuesta.ok) {
                const data = await respuesta.json();
                alert(`Usuario registrado con éxito. ID: ${data.id}`);
                form.reset();
                edadDisplay.textContent = "0 años";
            } else {
                const error = await respuesta.json();
                alert(`Error en el servidor: ${error.message}`);
            }
        } catch (error) {
            alert("Error al conectar con el servidor. Intenta nuevamente.");
        }
    });


    fechaNacimientoInput.addEventListener("input", () => {
        const fechaNacimiento = fechaNacimientoInput.value;
        const edad = calcularEdad(fechaNacimiento);
        edadDisplay.textContent = `${edad} años`;
    });
});
