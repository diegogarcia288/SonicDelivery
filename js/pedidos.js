function cambiarDisponibilidad(estado) {
    if (estado === 'activo') {
        Swal.fire({
            icon: "success",
            title: "¡Conectado!",
            text: "Ahora estás activo para recibir nuevos pedidos.",
            showConfirmButton: true
        });
    } 
    else if (estado === 'desactivo') {
        Swal.fire({
            icon: "info",
            title: "¡Desconectado!",
            text: "Te has desactivado. Ya no recibirás más pedidos por ahora.",
            showConfirmButton: true
        });
    }
}