document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formPunteo");
    const correoInput = document.getElementById("correo");
    const punteoInput = document.getElementById("punteo");

    const validarCorreo = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    const ValidarPunteo = (punteo) => /^[(punteo < 1 || punteo >100)]+$/ .test(punteo);

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

        const correo = correoInput.value;
        if (!validarCorreo(correo)) {
            mostrarError(correoInput, "El correo debe tener un formato válido (ej. ejemplo@dominio.com).");
            return;
        }
        limpiarErrores(correoInput);


        const punteo =punteoInput.value;
        if (!ValidarPunteo (punteo)) {
            mostrarError(punteoInput, "El punteo no puede ser menor a 1, pero tampoco mayor a 100.");
            return;
        }
        limpiarErrores(punteoInput);
        try {
            const respuesta = await fetch("http://localhost:3000/guardar_punteo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({correo,punteo}),
            });

            if (respuesta.ok) {
                const data = await respuesta.json();
                alert(`Usuario registrado con éxito. ID: ${data.id}`);
                form.reset();
            } else {
                const error = await respuesta.json();
                alert(`Error en el servidor: ${error.message}`);
            }
        } catch (error) {
            alert("Error al conectar con el servidor. Intenta nuevamente.");
        }
    });

});
