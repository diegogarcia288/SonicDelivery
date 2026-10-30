document.addEventListener("DOMContentLoaded", function() {
    
    // --- VALIDACIÓN DE SESIÓN EXISTENTE ---
    let rolActivo = localStorage.getItem("rolSonic");
    if (rolActivo) {
        // Si ya hay una sesión activa, redirigir automáticamente a su panel principal
        redirigirAlPanel(rolActivo);
        return;
    }

    // --- LÓGICA DEL MENÚ DESPLEGABLE Y REDIRECCIÓN AL LOGIN ---
    const btnContinuar = document.getElementById("btnContinuar");

    if (btnContinuar) {
        btnContinuar.addEventListener("click", function() {
            let rolSeleccionado = document.getElementById("rolSelect").value;

            // Validar que se haya seleccionado una opción
            if (!rolSeleccionado) {
                Swal.fire({
                    icon: "warning",
                    title: "Selección requerida",
                    text: "Por favor elige una opción del menú desplegable.",
                    confirmButtonText: "Entendido"
                });
                return;
            }

            // Redirigir a la respectiva página de inicio de sesión según el rol
            if (rolSeleccionado === "comercio") {
                window.location.href = "comercios/inicioComercio.html";
            } else if (rolSeleccionado === "repartidor") {
                window.location.href = "repartidores/inicioRepartidor.html";
            } else if (rolSeleccionado === "administrador") {
                // Ajustado al nombre exacto que tienes en tu carpeta de administradores
                window.location.href = "administradores/inicioAdministrador.html";
            }
        });
    }
});

// Función auxiliar para redirigir si la sesión ya está activa
function redirigirAlPanel(rol) {
    if (rol === "comercio") {
        window.location.href = "comercios/RealizaP.html";
    } else if (rol === "repartidor") {
        window.location.href = "repartidores/PedidosDD.html";
    } else if (rol === "administrador") {
        window.location.href = "administradores/PanelAdmin.html";
    }
}