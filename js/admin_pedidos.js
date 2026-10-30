console.log("¡El archivo JS de administración de pedidos está cargado y activo!");

function cargarTodosLosPedidosAdmin() {
    fetch('../PHP/obtener_pedidos_admin.php')
        .then(response => response.json())
        .then(data => {
            let contenedor = document.getElementById('lista-pedidos');
            if (!contenedor) return;
            contenedor.innerHTML = ''; // Limpiar antes de pintar

            if (data.length === 0) {
                contenedor.innerHTML = '<p>No hay pedidos registrados en el sistema.</p>';
                return;
            }

            data.forEach(pedido => {
                let esAsignado = pedido.estado && pedido.estado.toLowerCase() === 'asignado' || pedido.CedulaR !== null;
                
                let badgeEstado = esAsignado 
                    ? `<span class="text-warning fw-bold">${pedido.estado || 'Asignado'}</span>` 
                    : `<span class="text-success fw-bold">${pedido.estado || 'Activo'}</span>`;

                // Mostrar el nombre y cédula del repartidor si ya fue tomado
                let infoRepartidor = esAsignado && pedido.CedulaR 
                    ? `<p><strong>Repartidor Asignado:</strong> ${pedido.nombreRepartidor || 'Sin nombre'} (Cédula: ${pedido.CedulaR})</p>` 
                    : `<p><strong>Repartidor:</strong> <span class="text-muted">Pendiente de tomar</span></p>`;

                let botonAccion = !esAsignado 
                    ? `<button class="btn btn-secondary btn-sm mt-2" disabled>Disponible</button>` 
                    : `<button class="btn btn-info btn-sm mt-2 text-white" disabled>En curso</button>`;

                let tarjeta = `
                    <div class="pedido-card border p-3 mb-3 rounded bg-white shadow-sm">
                        <h3>Pedido #${pedido.ID_pedido}</h3>
                        <p><strong>Comercio:</strong> ${pedido.comercioP}</p>
                        <p><strong>Detalle:</strong> ${pedido.detalle}</p>
                        <p><strong>Dirección:</strong> ${pedido.direccion}</p>
                        <p><strong>Estado:</strong> ${badgeEstado}</p>
                        ${infoRepartidor}
                        ${botonAccion}
                    </div>
                `;
                contenedor.innerHTML += tarjeta;
            });
        })
        .catch(error => console.error('Error al actualizar los pedidos del admin:', error));
}

// ==========================================
// FUNCIÓN Y LISTENER PARA CERRAR SESIÓN (SEGURO)
// ==========================================
document.addEventListener("click", function(event) {
    let botonCerrar = event.target.closest("#btnCerrarSesion");

    if (botonCerrar) {
        event.preventDefault();
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

function redireccionarLogin() {
    window.location.href = window.location.origin + "/sonic_delivery/iniciosesion.html";
}

document.addEventListener('DOMContentLoaded', () => {
    cargarTodosLosPedidosAdmin();
    setInterval(cargarTodosLosPedidosAdmin, 4000);
});

console.log("¡admin_pedidos.js se cargó por completo en el Panel Admin!");