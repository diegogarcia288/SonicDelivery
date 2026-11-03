document.addEventListener("DOMContentLoaded", function() {
    function cargarPedidosTomados() {
        let cedulaRepartidor = localStorage.getItem('cedulaRepartidor');
        let tbodyTabla = document.getElementById('tablaPedidosBody');
        let contenedorCards = document.getElementById('contenedorTarjetasPedidosCelular');
        let contenedorAntiguo = document.getElementById('lista-pedidos'); // Compatibilidad por si acaso

        if (!cedulaRepartidor) {
            let msg = `<p class="text-danger text-center">No se encontró la sesión del repartidor. Por favor, inicia sesión nuevamente.</p>`;
            if (tbodyTabla) tbodyTabla.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Sesión no encontrada.</td></tr>`;
            if (contenedorCards) contenedorCards.innerHTML = `<div class="alert alert-danger">Sesión no encontrada.</div>`;
            if (contenedorAntiguo) contenedorAntiguo.innerHTML = msg;
            return;
        }

        // Aseguramos la ruta correcta con la cédula del repartidor
        fetch(window.location.origin + `/sonic_delivery/PHP/repartidoresPHP/obtenerPedidosTomados.php?cedula=${cedulaRepartidor}`)
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    let msg = `<p class="text-muted text-center py-3">No tienes pedidos tomados actualmente.</p>`;
                    if (tbodyTabla) tbodyTabla.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No tienes pedidos tomados actualmente.</td></tr>`;
                    if (contenedorCards) contenedorCards.innerHTML = `<div class="text-center text-dark p-3 bg-light rounded-3 border">No tienes pedidos tomados</div>`;
                    if (contenedorAntiguo && !tbodyTabla) contenedorAntiguo.innerHTML = msg;
                    return;
                }

                let htmlTabla = '';
                let htmlTarjetas = '';

                data.forEach(pedido => {
                    let idPedido = pedido.ID_pedido || pedido.id_pedido || '';
                    let estadoActual = pedido.estado || 'Asignado';
                    
                    let botonAccionTabla = '';
                    let botonAccionTarjeta = '';
                    let badgeClass = 'bg-primary';

                    if (estadoActual.toLowerCase() === 'asignado') {
                        botonAccionTabla = `<button class="btn btn-warning btn-sm btn-cambiar-estado fw-bold px-3" data-id="${idPedido}" data-nuevo="Recogido">Marcar Recogido</button>`;
                        botonAccionTarjeta = `<button class="btn btn-warning btn-sm btn-cambiar-estado fw-bold w-100 text-uppercase shadow-sm text-dark" data-id="${idPedido}" data-nuevo="Recogido">📦 Marcar Recogido</button>`;
                        badgeClass = 'bg-primary';
                    } else if (estadoActual.toLowerCase() === 'recogido') {
                        botonAccionTabla = `<button class="btn btn-success btn-sm btn-cambiar-estado fw-bold px-3" data-id="${idPedido}" data-nuevo="Entregado">Marcar Entregado</button>`;
                        botonAccionTarjeta = `<button class="btn btn-success btn-sm btn-cambiar-estado fw-bold w-100 text-uppercase shadow-sm" data-id="${idPedido}" data-nuevo="Entregado">✅ Marcar Entregado</button>`;
                        badgeClass = 'bg-warning text-dark';
                    } else {
                        botonAccionTabla = `<span class="badge bg-secondary">Finalizado</span>`;
                        botonAccionTarjeta = `<span class="badge bg-secondary w-100 py-2">Finalizado</span>`;
                    }

                    // 1. Fila para la tabla de PC
                    htmlTabla += `
                        <tr>
                            <td><strong>#${idPedido}</strong></td>
                            <td>${pedido.comercioP || ''}</td>
                            <td>${pedido.detalle || 'Sin detalles'}</td>
                            <td>${pedido.direccion || ''}</td>
                            <td><span class="badge ${badgeClass}">${estadoActual}</span></td>
                            <td>${botonAccionTabla}</td>
                        </tr>
                    `;

                    // 2. Tarjeta optimizada para Celular
                    htmlTarjetas += `
                        <div class="card shadow-sm mb-3 rounded-3" style="background-color: rgb(39, 132, 186); color: white; border: 4px solid rgb(18, 79, 114) !important;">
                            <div class="card-body p-3">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge bg-dark">Pedido: #${idPedido}</span>
                                    <span class="badge ${badgeClass}">${estadoActual}</span>
                                </div>
                                <h6 class="fw-bold mb-1">🏪 Comercio: <span class="fw-normal">${pedido.comercioP || 'N/D'}</span></h6>
                                <p class="mb-1 small text-white-50">Detalles: <span class="text-white">${pedido.detalle || 'Sin detalles'}</span></p>
                                <p class="mb-2 small text-white-50">📍 Dirección: <span class="text-white">${pedido.direccion || ''}</span></p>
                                ${botonAccionTarjeta}
                            </div>
                        </div>
                    `;
                });

                if (tbodyTabla) tbodyTabla.innerHTML = htmlTabla;
                if (contenedorCards) contenedorCards.innerHTML = htmlTarjetas;
            })
            .catch(error => {
                console.error('Error al cargar pedidos:', error);
                if (tbodyTabla) tbodyTabla.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error al conectar con el servidor.</td></tr>`;
                if (contenedorCards) contenedorCards.innerHTML = `<div class="text-center text-danger p-3 bg-light rounded-3 border">Error de conexión</div>`;
            });
    }

    cargarPedidosTomados();
});

// Listener global para procesar el cambio de estado con SweetAlert2
document.addEventListener("click", function(event) {
    let botonEstado = event.target.closest(".btn-cambiar-estado");
    if (botonEstado) {
        let idPedido = botonEstado.getAttribute("data-id");
        let nuevoEstado = botonEstado.getAttribute("data-nuevo");
        let cedulaRepartidor = localStorage.getItem("cedulaRepartidor");

        Swal.fire({
            title: `¿Cambiar estado a ${nuevoEstado}?`,
            text: "Se actualizará el estado del pedido en el sistema.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, actualizar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(window.location.origin + "/sonic_delivery/PHP/repartidoresPHP/actualizarEstadoPedido.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `id_pedido=${idPedido}&nuevo_estado=${nuevoEstado}&cedula_repartidor=${cedulaRepartidor}`
                })
                .then(response => response.json())
                .then(data => {
                    if (data.exito) {
                        Swal.fire({
                            icon: "success",
                            title: "¡Actualizado!",
                            text: `El pedido ahora está ${nuevoEstado}.`,
                            timer: 1500,
                            showConfirmButton: false
                        }).then(() => {
                            location.reload(); 
                        });
                    } else {
                        Swal.fire("Error", data.mensaje || "No se pudo actualizar el estado.", "error");
                    }
                })
                .catch(error => {
                    console.error("Error en la petición:", error);
                    Swal.fire("Error", "No se pudo conectar con el servidor.", "error");
                });
            }
        });
    }
});