console.log("¡El archivo JS de administración de repartidores está cargado y activo!");

function cargarRepartidoresActivosAdmin() {
    // Usamos la ruta absoluta apuntando a la ubicación correcta en administradorPHP
    fetch(window.location.origin + '/sonic_delivery/PHP/administradorPHP/repartidoresActivos.php')
        .then(response => response.json())
        .then(data => {
            let tbodyTabla = document.getElementById('tablaRepartidoresBody');
            let contenedorCards = document.getElementById('contenedorTarjetasCelular');

            if (!tbodyTabla && !contenedorCards) return;

            if (!data || data.length === 0) {
                if (tbodyTabla) {
                    tbodyTabla.innerHTML = `<tr><td colspan="4" class="text-center text-white py-3">No hay repartidores activos en este momento.</td></tr>`;
                }
                if (contenedorCards) {
                    contenedorCards.innerHTML = `<div class="text-center text-white p-3 bg-dark rounded-3 border border-light">No hay repartidores activos</div>`;
                }
                return;
            }

            let htmlTabla = '';
            let htmlTarjetas = '';

            data.forEach(rep => {
                let badgeEstado = '';
                
                // Validar estado según la cantidad de pedidos en curso
                if (rep.total_pedidos > 0) {
                    badgeEstado = `<span class="badge bg-warning text-dark">Activo con pedidos (${rep.total_pedidos})</span>`;
                } else {
                    badgeEstado = '<span class="badge bg-success">Activo sin pedidos</span>';
                }

                // 1. Fila para la tabla de PC
                htmlTabla += `
                    <tr>
                        <td><strong>#${rep.id}</strong></td>
                        <td class="fw-bold">${rep.nombre}</td>
                        <td>${badgeEstado}</td>
                        <td><span class="badge bg-secondary">${rep.total_pedidos}</span></td>
                    </tr>
                `;

                // 2. Tarjeta para la vista de Celular
                htmlTarjetas += `
                    <div class="card shadow-sm mb-3 rounded-3" style="background-color: rgb(39, 132, 186); color: white; border: 4px solid rgb(18, 79, 114) !important;">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="badge bg-dark">ID: #${rep.id}</span>
                                ${badgeEstado}
                            </div>
                            <h5 class="fw-bold mb-2">👤 ${rep.nombre}</h5>
                            <p class="mb-0 small text-white-50">Pedidos en curso: <strong class="text-white">${rep.total_pedidos}</strong></p>
                        </div>
                    </div>
                `;
            });

            if (tbodyTabla) tbodyTabla.innerHTML = htmlTabla;
            if (contenedorCards) contenedorCards.innerHTML = htmlTarjetas;
        })
        .catch(error => {
            console.error('Error al cargar los repartidores activos:', error);
            let tbodyTabla = document.getElementById('tablaRepartidoresBody');
            if (tbodyTabla) {
                tbodyTabla.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al conectar con el servidor.</td></tr>`;
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
    window.location.href = window.location.origin + "/sonic_delivery/iniciosesion.html";
}

// Ejecutar al cargar la página y refrescar cada 5 segundos
document.addEventListener('DOMContentLoaded', () => {
    cargarRepartidoresActivosAdmin();
    setInterval(cargarRepartidoresActivosAdmin, 5000);
});

console.log("¡Script del Panel Admin inicializado correctamente!");