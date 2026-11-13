// 1. Obtener referencias del DOM (coincidiendo con los IDs del HTML Base)
const inputIdRollo = document.getElementById("idRollo");
const inputMtsTotales = document.getElementById("mtsTotales");
const inputMtsDefecto = document.getElementById("mtsDefecto");
const btnAuditar = document.getElementById("btnAuditar");
const tablaMermas = document.getElementById("tablaMermas");

// 2. Clase RolloAuditado (Requerimiento 1)
class RolloAuditado {
    constructor(id, metrosTotales, metrosDefecto, porcentajeMerma, estado) {
        this.id = id;
        this.metrosTotales = metrosTotales;
        this.metrosDefecto = metrosDefecto;
        this.porcentajeMerma = porcentajeMerma;
        this.estado = estado;
    }
}

// 3. Eventos principales
document.addEventListener("DOMContentLoaded", cargarAuditorias);
btnAuditar.addEventListener("click", guardarAuditoria);

// 4. Función para calcular el porcentaje de defecto (Requerimiento 2)
function calcularPorcentajeMerma(metrosDefecto, metrosTotales) {
    return (metrosDefecto / metrosTotales) * 100;
}

// Función auxiliar para determinar el estado de calidad según el % de merma
function determinarEstado(porcentaje) {
    if (porcentaje <= 5) {
        return "Aprobado";
    } else if (porcentaje <= 15) {
        return "Revisión";
    } else {
        return "Rechazado";
    }
}

// 5. Función principal para validar, instanciar y guardar (Requerimiento 3 y 4)
function guardarAuditoria() {
    const id = inputIdRollo.value.trim();
    const mtsTotales = parseFloat(inputMtsTotales.value);
    const mtsDefecto = parseFloat(inputMtsDefecto.value);

    // Validaciones preventivas
    if (id === "" || isNaN(mtsTotales) || isNaN(mtsDefecto)) {
        return alert("Por favor, completa todos los campos correctamente.");
    }

    if (mtsTotales <= 0 || mtsDefecto < 0) {
        return alert("Los metros deben ser valores positivos.");
    }

    if (mtsDefecto > mtsTotales) {
        return alert("Error: Los metros con defecto no pueden ser mayores a los metros totales.");
    }

    // Cálculos
    const porcentaje = calcularPorcentajeMerma(mtsDefecto, mtsTotales);
    const porcentajeFormateado = porcentaje.toFixed(2); // Redondea a 2 decimales
    const estado = determinarEstado(porcentaje);

    // Crear el objeto usando la clase RolloAuditado
    const nuevoRollo = new RolloAuditado(id, mtsTotales, mtsDefecto, porcentajeFormateado, estado);

    // Guardar en LocalStorage
    const auditorias = obtenerAuditorias();
    auditorias.push(nuevoRollo);
    localStorage.setItem("auditoriasMermas", JSON.stringify(auditorias));

    // Actualizar tabla y limpiar inputs
    Mostrar();
    inputIdRollo.value = "";
    inputMtsTotales.value = "";
    inputMtsDefecto.value = "";
    inputIdRollo.focus();
}

// 6. Obtener datos del LocalStorage usando el operador ||
function obtenerAuditorias() {
    return JSON.parse(localStorage.getItem("auditoriasMermas")) || [];
}

// 7. Renderizar la tabla en el DOM usando innerHTML
function Mostrar() {
    const auditorias = obtenerAuditorias();
    let contenidoHTML = "";

    auditorias.forEach(function(rollo) {
        // Asignar color de badge de Bootstrap según el estado
        let colorBadge = "bg-success";
        if (rollo.estado === "Revisión") {
            colorBadge = "bg-warning text-dark";
        } else if (rollo.estado === "Rechazado") {
            colorBadge = "bg-danger";
        }

        contenidoHTML += `
            <tr>
                <td><strong>${rollo.id}</strong></td>
                <td>${rollo.metrosTotales} m</td>
                <td>${rollo.porcentajeMerma}%</td>
                <td><span class="badge ${colorBadge}">${rollo.estado}</span></td>
            </tr>
        `;
    });

    tablaMermas.innerHTML = contenidoHTML;
}

// Cargar datos al abrir o recargar la página
function cargarAuditorias() {
    Mostrar();
}