console.log("¡El archivo JS de administración de pedidos está cargado y activo!");

function cargarTodosLosPedidosAdmin() {
    fetch('../PHP/obtener_pedidos_admin.php')
        .then(response => response.json())
        .then(data => {
            let contenedor = document.getElementById('lista-pedidos');
            if (!contenedor) return;

            if (data.length === 0) {
                contenedor.innerHTML = '<p class="text-muted">No hay pedidos registrados en el sistema.</p>';
                return;
            }

            // Estructura de tabla idéntica y profesional
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
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            data.forEach(pedido => {
                let esAsignado = pedido.estado && pedido.estado.toLowerCase() === 'asignado' || pedido.CedulaR !== null;
                
                let badgeEstado = esAsignado 
                    ? `<span class="badge bg-warning text-dark">${pedido.estado || 'Asignado'}</span>` 
                    : `<span class="badge bg-success">${pedido.estado || 'Activo'}</span>`;

                let infoRepartidor = esAsignado && pedido.CedulaR 
                    ? `${pedido.nombreRepartidor || 'Sin nombre'} <br><small class="text-muted">(Cédula: ${pedido.CedulaR})</small>` 
                    : `<span class="text-muted">Pendiente de tomar</span>`;

                let botonAccion = !esAsignado 
                    ? `<button class="btn btn-secondary btn-sm" disabled>Disponible</button>` 
                    : `<button class="btn btn-info btn-sm text-white" disabled>En curso</button>`;

                let idPedido = pedido.ID_pedido || pedido.id_pedido || '';

                html += `
                    <tr>
                        <td><strong>#${idPedido}</strong></td>
                        <td>${pedido.comercioP || ''}</td>
                        <td>${pedido.detalle || 'Sin detalles'}</td>
                        <td>${pedido.direccion || ''}</td>
                        <td>${badgeEstado}</td>
                        <td>${infoRepartidor}</td>
                        <td>${botonAccion}</td>
                    </tr>
                `;
            });

            html += `</tbody></table></div>`;
            contenedor.innerHTML = html;
        })
        .catch(error => console.error('Error al actualizar los pedidos del admin:', error));
}

// ==========================================
// FUNCIÓN Y LISTENER PARA CERRAR SESIÓN (SEGURO Y CON CONFIRMACIÓN)
// ==========================================
document.addEventListener("click", function(event) {
    let botonCerrar = event.target.closest("#btnCerrarSesion");

    if (botonCerrar) {
        event.preventDefault();

        // Ventana de confirmación SweetAlert2
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
                // Limpieza de sesión
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
    // Como las vistas de administrador están en la subcarpeta administradores/, 
    // necesitamos subir un nivel (../) o usar la ruta absoluta del servidor.
    window.location.href = window.location.origin + "/sonic_delivery/iniciosesion.html";
}

document.addEventListener('DOMContentLoaded', () => {
    cargarTodosLosPedidosAdmin();
    setInterval(cargarTodosLosPedidosAdmin, 4000);
});

console.log("¡admin_pedidos.js se cargó por completo en el Panel Admin!");