console.log("¡Script de pedidos para comercio cargado y activo!");

function cargarPedidosComercio() {
    let contenedor = document.getElementById('lista-pedidos');
    if (!contenedor) return;

    let rol = localStorage.getItem('rolSonic');
    let nombreComercio = localStorage.getItem('nombreUsuario') || localStorage.getItem('usuarioComercio');

    if (!rol || rol.toLowerCase() !== 'comercio' || !nombreComercio) {
        contenedor.innerHTML = `<p class="text-danger">No se encontró la sesión del comercio. Por favor, inicia sesión nuevamente.</p>`;
        return;
    }

    // Ruta absoluta asegurada para evitar errores 404 desde la subcarpeta comercios
    let urlPhp = window.location.origin + '/sonic_delivery/PHP/comercioPHP/obtener_pedidos_comercios.php'; 
    let datosComercio = `comercioP=${encodeURIComponent(nombreComercio)}`;

    fetch(urlPhp, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datosComercio
    })
    .then(response => response.json())
    .then(data => {
        console.log("Respuesta del servidor PHP:", data);

        if (!Array.isArray(data)) {
            contenedor.innerHTML = `<p class="text-muted">No hay pedidos registrados o el servidor devolvió un formato vacío.</p>`;
            return;
        }

        if (data.length === 0) {
            contenedor.innerHTML = '<p class="text-muted">No hay pedidos registrados por tu comercio en este momento.</p>';
            return;
        }

        let html = `
            <div class="table-responsive">
                <table class="table table-striped table-bordered align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th>ID Pedido</th>
                            <th>Detalles</th>
                            <th>Dirección</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.forEach(pedido => {
            let idPedido = pedido.ID_pedido || pedido.id_pedido || '';

            html += `
                <tr>
                    <td><strong>#${idPedido}</strong></td>
                    <td>${pedido.detalle || 'Sin detalles'}</td>
                    <td>${pedido.direccion || ''}</td>
                    <td><span class="badge bg-success">${pedido.estado || 'Activo'}</span></td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;
        contenedor.innerHTML = html;
    })
    .catch(error => {
        console.error('Error detallado en el fetch:', error);
        contenedor.innerHTML = `<p class="text-danger">Error al procesar los datos del servidor.</p>`;
    });
}

// Evento de cierre de sesión con SweetAlert2 optimizado
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
                // Limpieza del almacenamiento local
                localStorage.clear();

                Swal.fire({
                    title: '¡Sesión Cerrada!',
                    text: 'Has salido del sistema correctamente.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    // Redirección directa adaptada a la estructura de carpetas
                    window.location.href = window.location.origin + "/sonic_delivery/iniciosesion.html";
                });
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    cargarPedidosComercio();
    setInterval(cargarPedidosComercio, 4000);
});