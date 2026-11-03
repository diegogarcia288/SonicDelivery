console.log("¡pedidosajax.js inicializado en Pedidos Disponibles!");

function cargarPedidosDisponibles() {
    let tbodyTabla = document.getElementById('tablaPedidosBody');
    let contenedorCards = document.getElementById('contenedorTarjetasPedidosCelular');
    let contenedorAntiguo = document.getElementById('lista-pedidos'); // Compatibilidad por si acaso

    let cedulaRepartidor = localStorage.getItem('cedulaRepartidor');
    if (!cedulaRepartidor) {
        let msg = `<p class="text-danger text-center">No se encontró la sesión del repartidor. Por favor, inicia sesión nuevamente.</p>`;
        if (tbodyTabla) tbodyTabla.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Sesión no encontrada.</td></tr>`;
        if (contenedorCards) contenedorCards.innerHTML = `<div class="alert alert-danger">Sesión no encontrada.</div>`;
        if (contenedorAntiguo) contenedorAntiguo.innerHTML = msg;
        return;
    }

    fetch(window.location.origin + '/sonic_delivery/PHP/repartidoresPHP/obtener_pedidos.php')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                let msg = '<p class="text-muted text-center py-3">No hay pedidos disponibles en este momento.</p>';
                if (tbodyTabla) tbodyTabla.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No hay pedidos disponibles en este momento.</td></tr>`;
                if (contenedorCards) contenedorCards.innerHTML = `<div class="text-center text-dark p-3 bg-light rounded-3 border">No hay pedidos disponibles</div>`;
                if (contenedorAntiguo && !tbodyTabla) contenedorAntiguo.innerHTML = msg;
                return;
            }

            let htmlTabla = '';
            let htmlTarjetas = '';

            data.forEach(pedido => {
                let idPedido = pedido.ID_pedido || pedido.id_pedido || '';
                let estadoPedido = pedido.estado || 'Activo';

                // 1. Fila para la tabla de la PC
                htmlTabla += `
                    <tr>
                        <td><strong>#${idPedido}</strong></td>
                        <td>${pedido.comercioP || ''}</td>
                        <td>${pedido.detalle || 'Sin detalles'}</td>
                        <td>${pedido.direccion || ''}</td>
                        <td><span class="badge bg-success">${estadoPedido}</span></td>
                        <td>
                            <button class="btn btn-primary btn-sm btn-tomar-pedido fw-bold px-3" data-id="${idPedido}">
                                Tomar Pedido
                            </button>
                        </td>
                    </tr>
                `;

                // 2. Tarjeta optimizada para Celular
                htmlTarjetas += `
                    <div class="card shadow-sm mb-3 rounded-3" style="background-color: rgb(39, 132, 186); color: white; border: 4px solid rgb(18, 79, 114) !important;">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="badge bg-dark">Pedido: #${idPedido}</span>
                                <span class="badge bg-success">${estadoPedido}</span>
                            </div>
                            <h6 class="fw-bold mb-1">🏪 Comercio: <span class="fw-normal">${pedido.comercioP || 'N/D'}</span></h6>
                            <p class="mb-1 small text-white-50">Detalles: <span class="text-white">${pedido.detalle || 'Sin detalles'}</span></p>
                            <p class="mb-2 small text-white-50">📍 Dirección: <span class="text-white">${pedido.direccion || ''}</span></p>
                            <button class="btn btn-light btn-sm btn-tomar-pedido fw-bold w-100 text-uppercase shadow-sm" data-id="${idPedido}" style="color: rgb(18, 79, 114);">
                                🛵 Tomar Pedido
                            </button>
                        </div>
                    </div>
                `;
            });

            if (tbodyTabla) tbodyTabla.innerHTML = htmlTabla;
            if (contenedorCards) contenedorCards.innerHTML = htmlTarjetas;
        })
        .catch(error => {
            console.error('Error al actualizar los pedidos:', error);
            let msg = `<p class="text-danger text-center">Error al conectar con el servidor.</p>`;
            if (tbodyTabla) tbodyTabla.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error al conectar con el servidor.</td></tr>`;
            if (contenedorCards) contenedorCards.innerHTML = `<div class="text-center text-danger p-3 bg-light rounded-3 border">Error de conexión</div>`;
        });
}

// ==========================================
// LISTENER GLOBAL PARA TOMAR EL PEDIDO
// ==========================================
document.addEventListener("click", function(event) {
    let botonTomar = event.target.closest(".btn-tomar-pedido");
    if (botonTomar) {
        
        let estadoActual = localStorage.getItem("estadoRepartidor") || "";

        if (estadoActual.toLowerCase() !== 'activo') {
            Swal.fire({
                icon: "warning",
                title: "Acción Denegada",
                text: "Debes hacer clic en 'Activarse' antes de poder tomar un pedido.",
                confirmButtonText: "Entendido"
            });
            return;
        }

        let idPedido = botonTomar.getAttribute("data-id");
        let cedulaRepartidor = localStorage.getItem("cedulaRepartidor");

        if (!cedulaRepartidor) {
            Swal.fire("Error", "No se encontró la cédula en la sesión. Inicia sesión nuevamente.", "error");
            return;
        }

        fetch(window.location.origin + "/sonic_delivery/PHP/repartidoresPHP/asignarPedido.php", {
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
                    cargarPedidosDisponibles();
                });
            } else {
                Swal.fire("Error", data.mensaje, "error");
            }
        })
        .catch(error => console.error("Error al asignar:", error));
    }
});

// Ejecutar al cargar la página y repetir cada 4 segundos (solo si hay sesión)
document.addEventListener('DOMContentLoaded', () => {
    cargarPedidosDisponibles();
    setInterval(() => {
        if (localStorage.getItem('cedulaRepartidor')) {
            cargarPedidosDisponibles();
        }
    }, 4000);
});