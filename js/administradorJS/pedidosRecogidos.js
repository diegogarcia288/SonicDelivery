console.log("¡pedidosRecogidos.js cargado correctamente!");

function cargarPedidosRecogidosAdmin() {
    fetch(window.location.origin + '/sonic_delivery/PHP/administradorPHP/obtener_pedidos_admin.php')
        .then(response => response.json())
        .then(data => {
            let tbodyTabla = document.getElementById('tablaPedidosBody');
            let contenedorCards = document.getElementById('contenedorTarjetasPedidosCelular');

            if (!tbodyTabla && !contenedorCards) return;

            if (!data || data.length === 0) {
                if (tbodyTabla) tbodyTabla.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No hay pedidos registrados en el sistema.</td></tr>`;
                if (contenedorCards) contenedorCards.innerHTML = `<div class="text-center text-dark p-3 bg-light rounded-3 border">No hay pedidos registrados</div>`;
                return;
            }

            // Filtrar únicamente los pedidos que estén en estado "Recogido"
            let pedidosRecogidos = data.filter(p => {
                let estado = p.estado ? p.estado.toLowerCase().trim() : '';
                return estado === 'recogido';
            });

            if (pedidosRecogidos.length === 0) {
                if (tbodyTabla) tbodyTabla.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No hay pedidos recogidos en este momento.</td></tr>`;
                if (contenedorCards) contenedorCards.innerHTML = `<div class="text-center text-dark p-3 bg-light rounded-3 border">No hay pedidos recogidos en este momento</div>`;
                return;
            }

            let htmlTabla = '';
            let htmlTarjetas = '';

            pedidosRecogidos.forEach(pedido => {
                let estadoActual = pedido.estado ? pedido.estado.trim() : 'Recogido';
                let badgeEstado = `<span class="badge bg-warning text-dark">${estadoActual}</span>`;

                let infoRepartidorTabla = pedido.CedulaR 
                    ? `${pedido.nombreRepartidor || 'Sin nombre'} <br><small class="text-muted">(Cédula: ${pedido.CedulaR})</small>` 
                    : `<span class="text-muted">Sin asignar</span>`;

                let infoRepartidorTexto = pedido.CedulaR 
                    ? `${pedido.nombreRepartidor || 'Sin nombre'} (Cédula: ${pedido.CedulaR})` 
                    : 'Sin asignar';

                let idPedido = pedido.ID_pedido || pedido.id_pedido || '';

                // 1. Fila para la tabla de PC
                htmlTabla += `
                    <tr>
                        <td><strong>#${idPedido}</strong></td>
                        <td>${pedido.comercioP || ''}</td>
                        <td>${pedido.detalle || 'Sin detalles'}</td>
                        <td>${pedido.direccion || ''}</td>
                        <td>${badgeEstado}</td>
                        <td>${infoRepartidorTabla}</td>
                    </tr>
                `;

                // 2. Tarjeta para Celular
                htmlTarjetas += `
                    <div class="card shadow-sm mb-3 rounded-3" style="background-color: rgb(39, 132, 186); color: white; border: 4px solid rgb(18, 79, 114) !important;">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="badge bg-dark">Pedido: #${idPedido}</span>
                                ${badgeEstado}
                            </div>
                            <h6 class="fw-bold mb-1">🏪 Comercio: <span class="fw-normal">${pedido.comercioP || 'N/D'}</span></h6>
                            <p class="mb-1 small text-white-50">Detalles: <span class="text-white">${pedido.detalle || 'Sin detalles'}</span></p>
                            <p class="mb-1 small text-white-50">📍 Dirección: <span class="text-white">${pedido.direccion || ''}</span></p>
                            <p class="mb-0 small text-white-50">Repartidor: <strong class="text-white">${infoRepartidorTexto}</strong></p>
                        </div>
                    </div>
                `;
            });

            if (tbodyTabla) tbodyTabla.innerHTML = htmlTabla;
            if (contenedorCards) contenedorCards.innerHTML = htmlTarjetas;
        })
        .catch(error => {
            console.error('Error al cargar los pedidos recogidos:', error);
            let tbodyTabla = document.getElementById('tablaPedidosBody');
            if (tbodyTabla) {
                tbodyTabla.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error al conectar con el servidor.</td></tr>`;
            }
        });
}

// Ejecutar al cargar la página y refrescar automáticamente cada 4 segundos
document.addEventListener('DOMContentLoaded', () => {
    cargarPedidosRecogidosAdmin();
    setInterval(cargarPedidosRecogidosAdmin, 4000);
});