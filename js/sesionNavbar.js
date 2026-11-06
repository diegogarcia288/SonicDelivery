document.addEventListener("DOMContentLoaded", function() {
    // Obtenemos el nombre de usuario de cualquier posible clave guardada en el login
    let nombre = localStorage.getItem('nombreUsuario') || localStorage.getItem('usuarioComercio') || localStorage.getItem('nombreRepartidor');
    let spanSesion = document.getElementById("infoSesion");

    // Asignamos el nombre limpio al elemento del navbar
    if (nombre && spanSesion) {
        spanSesion.textContent = nombre;
    }

    let btnCerrar = document.getElementById("btnCerrarSesion");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", function(event) {
            event.preventDefault();
            event.stopPropagation();

            // Identificamos la cédula independientemente del rol que cierre sesión
            let cedulaUsuario = localStorage.getItem('cedulaRepartidor') || localStorage.getItem('cedula') || localStorage.getItem('CedulaR');

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
                        ejecutarCierreSesion(cedulaUsuario);
                    }
                });
            } else {
                if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                    ejecutarCierreSesion(cedulaUsuario);
                }
            }
        });
    }
});

async function ejecutarCierreSesion(cedula) {
    // Si existe una cédula asociada (por ejemplo, repartidor), actualizamos su estado a Inactivo en el servidor
    if (cedula) {
        try {
            let response = await fetch(window.location.origin + "/sonic_delivery/PHP/repartidoresPHP/actualizarestado.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `cedula=${cedula}&estado=Inactivo`
            });

            let data = await response.json();
            console.log("Respuesta del servidor PHP:", data);
        } catch (error) {
            console.error("Error al actualizar el estado en el servidor:", error);
        }
    }

    // Limpiamos todo el almacenamiento local y redirigimos al login principal
    localStorage.clear(); 
    window.location.href = window.location.origin + "/sonic_delivery/iniciosesion.html";
}