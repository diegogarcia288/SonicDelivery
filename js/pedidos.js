
function verificarEstado(estado) {
   
    if (estado === 'pendiente') {
        Swal.fire({
            icon: "success",
            title: "¡Pedido Tomado!",
            text: "El pedido fue tomado con éxito.",
            showConfirmButton: true
        });
    } 

    else if (estado === 'recogido') {
        Swal.fire({
            icon: "warning",
            title: "Alerta de Pedido",
            text: "Este pedido ya ha sido recogido.",
            showConfirmButton: true
        });
    } 
 
    else if (estado === 'entregado') {
        Swal.fire({
            icon: "info",
            title: "Pedido Entregado",
            text: "El pedido ya fue entregado al cliente.",
            showConfirmButton: true
        });
    }




}
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