document.addEventListener("DOMContentLoaded", function() {
    let rol = localStorage.getItem('rolSonic');
    let nombre = localStorage.getItem('nombreUsuario') || localStorage.getItem('usuarioComercio') || localStorage.getItem('nombreRepartidor');
    let spanSesion = document.getElementById("infoSesion");

    if (rol && nombre && spanSesion) {
        spanSesion.textContent = `${rol}: ${nombre}`;
    }

    // Vinculación directa al botón por su ID
    let btnCerrar = document.getElementById("btnCerrarSesion");
    if (btnCerrar) {
        // Removemos listeners previos clonando el nodo si fuera necesario, y agregamos el click
        btnCerrar.addEventListener("click", function(event) {
            event.preventDefault();
            event.stopPropagation(); // Evita que otro script capture el evento

            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: "¿Cerrar sesión?",
                    text: "¿Estás seguro de que deseas salir?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, salir",
                    cancelButtonText: "Cancelar",
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33"
                }).then((result) => {
                    if (result.isConfirmed) {
                        ejecutarCierreSesion();
                    }
                });
            } else {
                // Alerta nativa de respaldo por si SweetAlert no cargara
                if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                    ejecutarCierreSesion();
                }
            }
        });
    } else {
        console.warn("No se encontró el botón #btnCerrarSesion en esta vista.");
    }
});

function ejecutarCierreSesion() {
    // Limpieza total del almacenamiento local
    localStorage.removeItem('rolSonic');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('usuarioComercio');
    localStorage.removeItem('nombreRepartidor');
    localStorage.removeItem('cedulaRepartidor');
    localStorage.removeItem('estadoRepartidor');
    localStorage.clear(); 
    
    // Redirección absoluta asegurada al login principal en la raíz
    window.location.href = window.location.origin + "/sonic_delivery/iniciosesion.html";
}