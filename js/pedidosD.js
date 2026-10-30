document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Validar que exista la sesión de repartidor
    let rolActivo = localStorage.getItem("rolSonic");
    if (rolActivo !== "repartidor") {
        Swal.fire({
            icon: "error",
            title: "Acceso denegado",
            text: "Debes iniciar sesión como repartidor para ver esta sección."
        }).then(() => {
            window.location.href = "../index.html";
        });
        return;
    }

    // 2. Escuchar clics en los botones de tomar pedido (delegación de eventos)
    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("btn-tomar-pedido")) {
            let idPedido = event.target.getAttribute("data-id");
            let cedulaRepartidor = localStorage.getItem("cedulaRepartidor");

            if (!cedulaRepartidor) {
                Swal.fire("Error", "No se encontró la cédula en la sesión. Inicia sesión nuevamente.", "error");
                return;
            }

            // 3. Enviar los datos mediante fetch al PHP de asignación
            fetch("../PHP/asignarPedido.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `id_pedido=${idPedido}&cedula_repartidor=${cedulaRepartidor}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.exito) {
                    Swal.fire({
                        icon: "success",
                        title: "¡Pedido tomado!",
                        text: "Se ha asignado a tu cédula correctamente.",
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        location.reload(); // Recargar la página para actualizar la lista de disponibles
                    });
                } else {
                    Swal.fire("Error", data.mensaje, "error");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire("Error", "Ocurrió un error al conectar con el servidor.", "error");
            });
        }
    });
});