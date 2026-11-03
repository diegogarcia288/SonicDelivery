console.log("¡Script unificado de comercio cargado y activo!");

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica para la vista de listado de pedidos
    let tbodyTabla = document.getElementById('tablaPedidosBody');
    let contenedorCards = document.getElementById('contenedorTarjetasPedidosCelular');
    let contenedorAntiguo = document.getElementById('lista-pedidos');

    if (tbodyTabla || contenedorCards || contenedorAntiguo) {
        cargarPedidosComercio();
        setInterval(cargarPedidosComercio, 4000);
    }

    // 2. Lógica para el formulario de realizar pedido
    let inputComercio = document.getElementById('Comercio');
    if (inputComercio) {
        let nombreComercio = localStorage.getItem('nombreUsuario') || localStorage.getItem('usuarioComercio');
        if (nombreComercio) {
            inputComercio.value = nombreComercio;
        }
    }
});

// Función para cargar los pedidos del comercio (sin filtros restrictivos de estado)
function cargarPedidosComercio() {
    let tbodyTabla = document.getElementById('tablaPedidosBody');
    let contenedorCards = document.getElementById('contenedorTarjetasPedidosCelular');
    let contenedorAntiguo = document.getElementById('lista-pedidos');

    let rol = localStorage.getItem('rolSonic');
    let nombreComercio = localStorage.getItem('nombreUsuario') || localStorage.getItem('usuarioComercio');

    if (!rol || rol.toLowerCase() !== 'comercio' || !nombreComercio) {
        let msg = `<p class="text-danger text-center">No se encontró la sesión del comercio. Por favor, inicia sesión nuevamente.</p>`;
        if (tbodyTabla) tbodyTabla.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Sesión no encontrada.</td></tr>`;
        if (contenedorCards) contenedorCards.innerHTML = `<div class="alert alert-danger">Sesión no encontrada.</div>`;
        if (contenedorAntiguo) contenedorAntiguo.innerHTML = msg;
        return;
    }

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
        if (!Array.isArray(data)) {
            let msg = `<p class="text-muted text-center py-3">No hay pedidos registrados o el servidor devolvió un formato vacío.</p>`;
            if (tbodyTabla) tbodyTabla.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">Formato de datos no válido.</td></tr>`;
            if (contenedorCards) contenedorCards.innerHTML = `<div class="text-center text-dark p-3 bg-light rounded-3 border">Formato vacío</div>`;
            if (contenedorAntiguo && !tbodyTabla) contenedorAntiguo.innerHTML = msg;
            return;
        }

        if (data.length === 0) {
            let msg = '<p class="text-muted text-center py-3">No hay pedidos registrados por tu comercio en este momento.</p>';
            if (tbodyTabla) tbodyTabla.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No hay pedidos registrados por tu comercio en este momento.</td></tr>`;
            if (contenedorCards) contenedorCards.innerHTML = `<div class="text-center text-dark p-3 bg-light rounded-3 border">No hay pedidos registrados</div>`;
            if (contenedorAntiguo && !tbodyTabla) contenedorAntiguo.innerHTML = msg;
            return;
        }

        let htmlTabla = '';
        let htmlTarjetas = '';

        data.forEach(pedido => {
            let idPedido = pedido.ID_pedido || pedido.id_pedido || '';
            let estadoPedido = pedido.estado ? pedido.estado.trim() : 'Activo';
            let estadoLower = estadoPedido.toLowerCase();

            // Colores distintivos según el estado del pedido
            let claseBadge = 'bg-success';
            if (estadoLower === 'asignado') claseBadge = 'bg-info text-dark';
            else if (estadoLower === 'recogido') claseBadge = 'bg-warning text-dark';
            else if (estadoLower === 'entregado') claseBadge = 'bg-primary';

            let badgeEstado = `<span class="badge ${claseBadge}">${estadoPedido}</span>`;

            // Información detallada del repartidor asignado
            let infoRepartidorTabla = pedido.CedulaR 
                ? `${pedido.nombreRepartidor || 'Sin nombre'} <br><small class="text-muted">(Cédula: ${pedido.CedulaR})</small>` 
                : `<span class="text-muted">Pendiente de tomar</span>`;

            let infoRepartidorTexto = pedido.CedulaR 
                ? `${pedido.nombreRepartidor || 'Sin nombre'} (Cédula: ${pedido.CedulaR})` 
                : 'Pendiente de tomar';

            // Fila para la tabla de la PC
            htmlTabla += `
                <tr>
                    <td><strong>#${idPedido}</strong></td>
                    <td>${pedido.detalle || 'Sin detalles'}</td>
                    <td>${pedido.direccion || ''}</td>
                    <td>${badgeEstado}</td>
                    <td>${infoRepartidorTabla}</td>
                </tr>
            `;

            // Tarjeta optimizada para Celular
            htmlTarjetas += `
                <div class="card shadow-sm mb-3 rounded-3" style="background-color: rgb(39, 132, 186); color: white; border: 4px solid rgb(18, 79, 114) !important;">
                    <div class="card-body p-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-dark">Pedido: #${idPedido}</span>
                            ${badgeEstado}
                        </div>
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
        console.error('Error detallado en el fetch:', error);
        let tbodyTabla = document.getElementById('tablaPedidosBody');
        let contenedorCards = document.getElementById('contenedorTarjetasPedidosCelular');
        if (tbodyTabla) tbodyTabla.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error al conectar con el servidor.</td></tr>`;
        if (contenedorCards) contenedorCards.innerHTML = `<div class="text-center text-danger p-3 bg-light rounded-3 border">Error de conexión</div>`;
    });
}

// Evento global de cierre de sesión con SweetAlert2
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

                Swal.fire({
                    title: '¡Sesión Cerrada!',
                    text: 'Has salido del sistema correctamente.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = window.location.origin + "/sonic_delivery/iniciosesion.html";
                });
            }
        });
    }
});