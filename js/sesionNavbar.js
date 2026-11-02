document.addEventListener("DOMContentLoaded", function() {
    let rol = localStorage.getItem('rolSonic');
    let nombre = localStorage.getItem('nombreUsuario') || localStorage.getItem('usuarioComercio') || localStorage.getItem('nombreRepartidor');
    let spanSesion = document.getElementById("infoSesion");

    // AQUÍ EL CAMBIO: Asignamos únicamente el nombre limpio, sin repetir "Rol:"
    if (nombre && spanSesion) {
        spanSesion.textContent = nombre;
    }

    let btnCerrar = document.getElementById("btnCerrarSesion");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", function(event) {
            event.preventDefault();
            event.stopPropagation();

            let cedulaRepartidor = localStorage.getItem('cedulaRepartidor') || localStorage.getItem('cedula') || localStorage.getItem('CedulaR');

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
                        ejecutarCierreSesion(cedulaRepartidor);
                    }
                });
            } else {
                if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                    ejecutarCierreSesion(cedulaRepartidor);
                }
            }
        });
    }
});

async function ejecutarCierreSesion(cedulaRepartidor) {
    if (cedulaRepartidor) {
        try {
            let response = await fetch(window.location.origin + "/sonic_delivery/PHP/repartidoresPHP/actualizarestado.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `cedula=${cedulaRepartidor}&estado=Inactivo`
            });

            let data = await response.json();
            console.log("Respuesta del servidor PHP:", data);
        } catch (error) {
            console.error("Error al actualizar el estado en el servidor:", error);
        }
    }

    localStorage.clear(); 
    window.location.href = window.location.origin + "/sonic_delivery/iniciosesion.html";
}