console.log("¡pedidosDisponiblesAdmin.js cargado correctamente!");

function cargarTodosLosPedidosAdmin() {
    // Usamos la ruta absoluta exacta apuntando a la subcarpeta administradorPHP
    fetch(window.location.origin + '/sonic_delivery/PHP/administradorPHP/obtener_pedidos_admin.php')
        .then(response => response.json())
        .then(data => {
            let contenedor = document.getElementById('lista-pedidos');
            if (!contenedor) return;

            if (data.length === 0) {
                contenedor.innerHTML = '<p class="text-muted">No hay pedidos registrados en el sistema.</p>';
                return;
            }

            // FILTRADO POR EXCLUSIÓN: Ocultar estrictamente los que ya fueron recogidos o entregados
            let pedidosDisponibles = data.filter(pedido => {
                let estado = pedido.estado ? pedido.estado.toLowerCase().trim() : '';
                return estado !== 'recogido' && estado !== 'entregado';
            });

            if (pedidosDisponibles.length === 0) {
                contenedor.innerHTML = '<p class="text-muted">No hay pedidos disponibles o asignados en este momento.</p>';
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

            pedidosDisponibles.forEach(pedido => {
                let estadoActual = pedido.estado ? pedido.estado.trim() : 'Activo';
                let estadoLower = estadoActual.toLowerCase();

                // Definir colores de badges
                let claseBadge = 'bg-success'; // Para Activo / sin estado
                if (estadoLower === 'asignado') {
                    claseBadge = 'bg-info text-dark';
                }

                let badgeEstado = `<span class="badge ${claseBadge}">${estadoActual}</span>`;

                // Mostrar info del repartidor si tiene cédula asociada
                let infoRepartidor = pedido.CedulaR 
                    ? `${pedido.nombreRepartidor || 'Sin nombre'} <br><small class="text-muted">(Cédula: ${pedido.CedulaR})</small>` 
                    : `<span class="text-muted">Pendiente de tomar</span>`;

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
            console.error('Error al actualizar los pedidos del admin:', error);
            let contenedor = document.getElementById('lista-pedidos');
            if (contenedor) {
                contenedor.innerHTML = `<p class="text-danger text-center">Error al conectar con el servidor.</p>`;
            }
        });
}

// ==========================================
// FUNCIÓN Y LISTENER PARA CERRAR SESIÓN
// ==========================================
document.addEventListener("click", function(event) {
    let botonCerrar = event.target.closest("#btnCerrarSesion");

    if (botonCerrar) {
        event.preventDefault();

        Swal.fire({
            title: '¿Cerrar sesión?',
            text: '¿Estás seguro de que deseas salir?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();

                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: '¡Sesión Cerrada!',
                        text: 'Has salido del sistema correctamente.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        redireccionarLogin();
                    });
                } else {
                    redireccionarLogin();
                }
            }
        });
    }
});

function redireccionarLogin() {
    window.location.href = window.location.origin + "/sonic_delivery/iniciosesion.html";
}

// Ejecutar al cargar la página y refrescar cada 4 segundos
document.addEventListener('DOMContentLoaded', () => {
    cargarTodosLosPedidosAdmin();
    setInterval(cargarTodosLosPedidosAdmin, 4000);
});

console.log("¡Script del Panel Admin de pedidos inicializado correctamente!");