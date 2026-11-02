document.addEventListener("DOMContentLoaded", function() {
    function cargarPedidosTomados() {
        let cedulaRepartidor = localStorage.getItem('cedulaRepartidor');
        const contenedor = document.getElementById('lista-pedidos');

        if (!contenedor) return;

        if (!cedulaRepartidor) {
            contenedor.innerHTML = `<p class="text-danger">No se encontró la sesión del repartidor. Por favor, inicia sesión nuevamente.</p>`;
            return;
        }

        // Aseguramos la ruta correcta con la cédula del repartidor
        fetch(window.location.origin + `/sonic_delivery/PHP/repartidoresPHP/obtenerPedidosTomados.php?cedula=${cedulaRepartidor}`)
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    contenedor.innerHTML = `<p class="text-muted">No tienes pedidos tomados actualmente.</p>`;
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
                    let estadoActual = pedido.estado || 'Asignado';
                    
                    // Definir qué botón mostrar según el estado exacto del pedido
                    let botonAccion = '';
                    let badgeClass = 'bg-primary';

                    if (estadoActual.toLowerCase() === 'asignado') {
                        botonAccion = `<button class="btn btn-warning btn-sm btn-cambiar-estado" data-id="${idPedido}" data-nuevo="Recogido">Marcar Recogido</button>`;
                        badgeClass = 'bg-primary';
                    } else if (estadoActual.toLowerCase() === 'recogido') {
                        // Si ya está recogido, muestra el botón para marcarlo como entregado
                        botonAccion = `<button class="btn btn-success btn-sm btn-cambiar-estado" data-id="${idPedido}" data-nuevo="Entregado">Marcar Entregado</button>`;
                        badgeClass = 'bg-warning text-dark';
                    } else {
                        botonAccion = `<span class="badge bg-secondary">Finalizado</span>`;
                    }

                    html += `
                        <tr>
                            <td><strong>#${idPedido}</strong></td>
                            <td>${pedido.comercioP || ''}</td>
                            <td>${pedido.detalle || 'Sin detalles'}</td>
                            <td>${pedido.direccion || ''}</td>
                            <td><span class="badge ${badgeClass}">${estadoActual}</span></td>
                            <td>${botonAccion}</td>
                        </tr>
                    `;
                });

                html += `</tbody></table></div>`;
                contenedor.innerHTML = html;
            })
            .catch(error => {
                console.error('Error al cargar pedidos:', error);
                contenedor.innerHTML = `<p class="text-danger">Ocurrió un error al cargar tus pedidos tomados.</p>`;
            });
    }

    cargarPedidosTomados();
});

// Listener global para procesar el cambio de estado con SweetAlert2
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("btn-cambiar-estado")) {
        let idPedido = event.target.getAttribute("data-id");
        let nuevoEstado = event.target.getAttribute("data-nuevo");
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
                            // En lugar de location.reload(), llamamos a la función interna o recargamos limpiamente
                            // para refrescar los datos sin perder el contexto de la vista.
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