document.addEventListener("DOMContentLoaded", function() {
    let cedulaRepartidor = localStorage.getItem('cedulaRepartidor');
    const contenedor = document.getElementById('lista-pedidos');

    if (!cedulaRepartidor) {
        contenedor.innerHTML = `<p class="text-danger">No se encontró la sesión del repartidor. Por favor, inicia sesión nuevamente.</p>`;
        return;
    }

    fetch(`../PHP/repartidoresPHP/obtenerPedidosTomados.php?cedula=${cedulaRepartidor}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
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
                            </tr>
                        </thead>
                        <tbody>
            `;

            data.forEach(pedido => {
                // Apuntamos exactamente a ID_pedido tal como está en la base de datos
                let idPedido = pedido.ID_pedido || pedido.id_pedido || '';

                html += `
                    <tr>
                        <td><strong>#${idPedido}</strong></td>
                        <td>${pedido.comercioP}</td>
                        <td>${pedido.detalle || 'Sin detalles'}</td>
                        <td>${pedido.direccion}</td>
                        <td><span class="badge bg-success">${pedido.estado}</span></td>
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
});