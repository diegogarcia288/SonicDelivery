console.log("¡Script de pedidos disponibles iniciado correctamente!");

function cargarTodosLosPedidosAdmin() {
    // Usamos la ruta absoluta exacta para evitar errores 404
    fetch(window.location.origin + '/sonic_delivery/PHP/administradorPHP/obtener_pedidos_admin.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            let tbodyTabla = document.getElementById('tablaPedidosBody');
            let contenedorCards = document.getElementById('contenedorTarjetasPedidosCelular');

            if (!data || data.length === 0) {
                if (tbodyTabla) tbodyTabla.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">No hay pedidos registrados en el sistema.</td></tr>`;
                if (contenedorCards) contenedorCards.innerHTML = `<div class="text-center text-dark p-3 bg-light rounded-3 border">No hay pedidos registrados</div>`;
                return;
            }

            // Filtrar para excluir los que ya fueron recogidos o entregados
            let pedidosDisponibles = data.filter(pedido => {
                let estado = pedido.estado ? pedido.estado.toLowerCase().trim() : '';
                return estado !== 'recogido' && estado !== 'entregado';
            });

            if (pedidosDisponibles.length === 0) {
                if (tbodyTabla) tbodyTabla.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">No hay pedidos disponibles en este momento.</td></tr>`;
                if (contenedorCards) contenedorCards.innerHTML = `<div class="text-center text-dark p-3 bg-light rounded-3 border">No hay pedidos disponibles</div>`;
                return;
            }

            let htmlTabla = '';
            let htmlTarjetas = '';

            pedidosDisponibles.forEach(pedido => {
                let estadoActual = pedido.estado ? pedido.estado.trim() : 'Activo';
                let estadoLower = estadoActual.toLowerCase();

                let claseBadge = 'bg-success';
                if (estadoLower === 'asignado') {
                    claseBadge = 'bg-info text-dark';
                }

                let badgeEstado = `<span class="badge ${claseBadge}">${estadoActual}</span>`;

                let infoRepartidorTabla = pedido.CedulaR 
                    ? `${pedido.nombreRepartidor || 'Sin nombre'} <br><small class="text-muted">(Cédula: ${pedido.CedulaR})</small>` 
                    : `<span class="text-muted">Pendiente de tomar</span>`;

                let infoRepartidorTexto = pedido.CedulaR 
                    ? `${pedido.nombreRepartidor || 'Sin nombre'} (Cédula: ${pedido.CedulaR})` 
                    : 'Pendiente de tomar';

                let idPedido = pedido.ID_pedido || pedido.id_pedido || '';

                // 1. Fila para la tabla de la PC
                htmlTabla += `
                    <tr>
                        <td><strong>#${idPedido}</strong></td>
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
            console.error('Error al cargar los pedidos:', error);
            let tbodyTabla = document.getElementById('tablaPedidosBody');
            if (tbodyTabla) {
                tbodyTabla.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al conectar con el servidor PHP.</td></tr>`;
            }
        });
}

// Ejecutar al cargar y refrescar cada 4 segundos
document.addEventListener('DOMContentLoaded', () => {
    cargarTodosLosPedidosAdmin();
    setInterval(cargarTodosLosPedidosAdmin, 4000);
});