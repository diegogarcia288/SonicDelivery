console.log("¡El archivo JS de administración de repartidores está cargado y activo!");

function cargarRepartidoresActivosAdmin() {
    // Usamos la ruta absoluta apuntando a la nueva ubicación en administradorPHP
    fetch(window.location.origin + '/sonic_delivery/PHP/administradorPHP/repartidoresActivos.php')
        .then(response => response.json())
        .then(data => {
            let contenedor = document.getElementById('tabla-repartidores');
            if (!contenedor) return;

            if (data.length === 0) {
                contenedor.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No hay repartidores activos en este momento.</td></tr>`;
                return;
            }

            let html = '';

            data.forEach(rep => {
                let badgeEstado = '';
                
                // Validar estado según la cantidad de pedidos en curso
                if (rep.total_pedidos > 0) {
                    badgeEstado = `<span class="badge bg-warning text-dark">Activo con pedidos (${rep.total_pedidos})</span>`;
                } else {
                    badgeEstado = '<span class="badge bg-success">Activo sin pedidos</span>';
                }

                html += `
                    <tr>
                        <td><strong>#${rep.id}</strong></td>
                        <td class="fw-bold">${rep.nombre}</td>
                        <td>${badgeEstado}</td>
                        <td><span class="badge bg-secondary">${rep.total_pedidos}</span></td>
                    </tr>
                `;
            });

            contenedor.innerHTML = html;
        })
        .catch(error => {
            console.error('Error al cargar los repartidores activos:', error);
            let contenedor = document.getElementById('tabla-repartidores');
            if (contenedor) {
                contenedor.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al conectar con el servidor.</td></tr>`;
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