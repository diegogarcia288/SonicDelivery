console.log("¡pedidosEntregados.js cargado correctamente!");

function cargarPedidosEntregadosAdmin() {
    // Usamos la ruta absoluta exacta para consultar los pedidos del admin
    fetch(window.location.origin + '/sonic_delivery/PHP/administradorPHP/obtener_pedidos_admin.php')
        .then(response => response.json())
        .then(data => {
            let contenedor = document.getElementById('lista-pedidos');
            if (!contenedor) return;

            if (!data || data.length === 0) {
                contenedor.innerHTML = '<p class="text-muted">No hay pedidos registrados en el sistema.</p>';
                return;
            }

            // Filtrar únicamente los pedidos que ya fueron entregados
            let pedidosEntregados = data.filter(p => {
                let estado = p.estado ? p.estado.toLowerCase().trim() : '';
                return estado === 'entregado';
            });

            if (pedidosEntregados.length === 0) {
                contenedor.innerHTML = '<p class="text-muted">No hay historial de pedidos entregados en este momento.</p>';
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
                                <th>Repartidor Asignado</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            pedidosEntregados.forEach(pedido => {
                let estadoActual = pedido.estado.trim();
                let badgeEstado = `<span class="badge bg-primary">${estadoActual}</span>`;

                let infoRepartidor = pedido.CedulaR 
                    ? `${pedido.nombreRepartidor || 'Sin nombre'} <br><small class="text-muted">(Cédula: ${pedido.CedulaR})</small>` 
                    : `<span class="text-muted">Sin asignar</span>`;

                let idPedido = pedido.ID_pedido || pedido.id_pedido || '';

                html += `
                    <tr>
                        <td><strong>#${idPedido}</strong></td>
                        <td>${pedido.comercioP || ''}</td>
                        <td>${pedido.detalle || 'Sin detalles'}</td>
                        <td>${pedido.direccion || ''}</td>
                        <td>${badgeEstado}</td>
                        <td>${infoRepartidor}</td>
                    </tr>
                `;
            });

            html += `</tbody></table></div>`;
            contenedor.innerHTML = html;
        })
        .catch(error => {
            console.error('Error al cargar los pedidos entregados:', error);
            let contenedor = document.getElementById('lista-pedidos');
            if (contenedor) {
                contenedor.innerHTML = `<p class="text-danger text-center">Error al conectar con el servidor.</p>`;
            }
        });
}

// Ejecutar al cargar la página y refrescar automáticamente cada 4 segundos
document.addEventListener('DOMContentLoaded', () => {
    cargarPedidosEntregadosAdmin();
    setInterval(cargarPedidosEntregadosAdmin, 4000);
});