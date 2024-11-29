document.addEventListener("DOMContentLoaded", () => {
    const reporteDiv = document.getElementById("reporte");

    const cargarReporte = async (codigoReporte) => {
        try {
            const respuesta = await fetch(`http://localhost:3000/ejecutar_reporte/${codigoReporte}`);
            if (!respuesta.ok) {
                throw new Error(`Error al cargar el reporte: ${respuesta.statusText}`);
            }

            const data = await respuesta.json();
            mostrarReporte(data);
        } catch (error) {
            reporteDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    };

    const mostrarReporte = (data) => {
        if (data.length === 0) {
            reporteDiv.innerHTML = "<p>No se encontraron resultados para este reporte.</p>";
            return;
        }

        const table = document.createElement("table");
        table.border = "1";
        const headerRow = table.insertRow();

        Object.keys(data[0]).forEach((key) => {
            const th = document.createElement("th");
            th.textContent = key.toUpperCase();
            headerRow.appendChild(th);
        });

        data.forEach((row) => {
            const tr = table.insertRow();
            Object.values(row).forEach((value) => {
                const td = tr.insertCell();
                td.textContent = value;
            });
        });

        reporteDiv.innerHTML = "";
        reporteDiv.appendChild(table);
    };

    document.querySelectorAll(".reportes-sidebar ul li button").forEach((button) => {
        button.addEventListener("click", () => {
            const reporte = button.getAttribute("data-reporte");
            cargarReporte(reporte);
        });
    });
});
