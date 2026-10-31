console.log("¡pedidosajax.js inicializado en Pedidos Disponibles!");

function cargarPedidosDisponibles() {
    let contenedor = document.getElementById('lista-pedidos');
    if (!contenedor) return;

    // Validación estricta de sesión: Si no hay cédula, muestra el mensaje y detiene todo
    let cedulaRepartidor = localStorage.getItem('cedulaRepartidor');
    if (!cedulaRepartidor) {
        contenedor.innerHTML = `<p class="text-danger">No se encontró la sesión del repartidor. Por favor, inicia sesión nuevamente.</p>`;
        return;
    }

    // Ruta de la subcarpeta repartidoresPHP
    fetch('../PHP/repartidoresPHP/obtener_pedidos.php')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                contenedor.innerHTML = '<p class="text-muted">No hay pedidos disponibles en este momento.</p>';
                return;
            }

            let html = `
                <div class="table-responsive">
                    <table class="table table-striped table-bordered align-middle">
                        <thead class="table-dark">
                            <tr>
                                <th>ID Pedido</th>
                                <th>Comercio</th>
                                <th>Detalles</th>
                                <th>Dirección</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            data.forEach(pedido => {
                let idPedido = pedido.ID_pedido || pedido.id_pedido || '';

                html += `
                    <tr>
                        <td><strong>#${idPedido}</strong></td>
                        <td>${pedido.comercioP || ''}</td>
                        <td>${pedido.detalle || 'Sin detalles'}</td>
                        <td>${pedido.direccion || ''}</td>
                        <td><span class="badge bg-success">${pedido.estado || 'Activo'}</span></td>
                        <td>
                            <button class="btn btn-primary btn-sm btn-tomar-pedido" data-id="${idPedido}">
                                Tomar Pedido
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += `</tbody></table></div>`;
            contenedor.innerHTML = html;
        })
        .catch(error => console.error('Error al actualizar los pedidos:', error));
}

// ==========================================
// FUNCIÓN PARA CAMBIAR DISPONIBILIDAD
// ==========================================
function cambiarDisponibilidad(estadoAccion) {
    let cedulaRepartidor = localStorage.getItem("cedulaRepartidor");

    if (!cedulaRepartidor) {
        Swal.fire("Error", "No se encontró la cédula en la sesión. Inicia sesión nuevamente.", "error");
        return;
    }

    let estadoBD = (estadoAccion === 'activo') ? 'Activo' : 'Inactivo';

    fetch("../PHP/repartidoresPHP/actualizarestado.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `cedula=${cedulaRepartidor}&estado=${estadoBD}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.exito) {
            localStorage.setItem("estadoRepartidor", estadoAccion);

            if (estadoAccion === 'activo') {
                Swal.fire({
                    icon: "success",
                    title: "¡Conectado!",
                    text: "Ahora estás activo para recibir nuevos pedidos.",
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: "info",
                    title: "¡Desconectado!",
                    text: "Te has desactivado. Ya no podrás tomar pedidos hasta conectarte.",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } else {
            Swal.fire("Error", data.mensaje, "error");
        }
    })
    .catch(error => console.error("Error al cambiar estado:", error));
}

// ==========================================
// LISTENER GLOBAL PARA TOMAR EL PEDIDO
// ==========================================
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("btn-tomar-pedido")) {
        
        let estadoActual = localStorage.getItem("estadoRepartidor");
        if (estadoActual !== 'activo') {
            Swal.fire({
                icon: "warning",
                title: "Acción Denegada",
                text: "Debes hacer clic en 'Activarse' antes de poder tomar un pedido.",
                confirmButtonText: "Entendido"
            });
            return;
        }

        let idPedido = event.target.getAttribute("data-id");
        let cedulaRepartidor = localStorage.getItem("cedulaRepartidor");

        if (!cedulaRepartidor) {
            Swal.fire("Error", "No se encontró la cédula en la sesión. Inicia sesión nuevamente.", "error");
            return;
        }

        fetch("../PHP/repartidoresPHP/asignarPedido.php", {
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
        .catch(error => console.error("Error:", error));
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