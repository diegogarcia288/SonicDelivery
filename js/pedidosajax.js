console.log("¡El archivo JS de sesión está cargado y activo!");

function cargarPedidosDisponibles() {
    fetch('../PHP/obtener_pedidos.php')
        .then(response => response.json())
        .then(data => {
            let contenedor = document.getElementById('lista-pedidos');
            if (!contenedor) return;
            contenedor.innerHTML = ''; // Limpiar antes de pintar

            if (data.length === 0) {
                contenedor.innerHTML = '<p>No hay pedidos disponibles en este momento.</p>';
                return;
            }

            // Recorrer los pedidos y armar las tarjetas visuales
            data.forEach(pedido => {
                let tarjeta = `
                    <div class="pedido-card border p-3 mb-3 rounded bg-white shadow-sm">
                        <h3>Pedido #${pedido.ID_pedido}</h3>
                        <p><strong>Comercio:</strong> ${pedido.comercioP}</p>
                        <p><strong>Detalle:</strong> ${pedido.detalle}</p>
                        <p><strong>Dirección:</strong> ${pedido.direccion}</p>
                        <p><strong>Estado:</strong> <span class="text-success fw-bold">${pedido.estado}</span></p>
                        <button class="btn btn-primary btn-tomar-pedido mt-2" data-id="${pedido.ID_pedido}">Tomar Pedido</button>
                    </div>
                `;
                contenedor.innerHTML += tarjeta;
            });
        })
        .catch(error => console.error('Error al actualizar los pedidos:', error));
}

// ==========================================
// LISTENER GLOBAL PARA TOMAR EL PEDIDO
// ==========================================
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("btn-tomar-pedido")) {
        let idPedido = event.target.getAttribute("data-id");
        let cedulaRepartidor = localStorage.getItem("cedulaRepartidor");

        if (!cedulaRepartidor) {
            Swal.fire("Error", "No se encontró la cédula en la sesión. Inicia sesión nuevamente.", "error");
            return;
        }

        // Enviar los datos por fetch al PHP de asignación
        fetch("../PHP/asignarPedido.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `id_pedido=${idPedido}&cedula_repartidor=${cedulaRepartidor}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.exito) {
                Swal.fire({
                    icon: "success",
                    title: "¡Pedido tomado!",
                    text: "Se ha asignado a tu cédula correctamente.",
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    cargarPedidosDisponibles(); // Actualizar la lista inmediatamente
                });
            } else {
                Swal.fire("Error", data.mensaje, "error");
            }
        })
        .catch(error => console.error("Error:", error));
    }
});

// ==========================================
// FUNCIÓN Y LISTENER PARA CERRAR SESIÓN (SEGURO)
// ==========================================
document.addEventListener("click", function(event) {
    // .closest() busca el botón sin importar si se hizo clic en un icono o texto interno
    let botonCerrar = event.target.closest("#btnCerrarSesion");

    if (botonCerrar) {
        event.preventDefault();

        // 1. Limpieza absoluta del almacenamiento local (elimina cédula, contraseñas y roles)
        localStorage.clear();

        // 2. Validación en consola para verificar que el almacenamiento quedó vacío
        console.log("Cédula tras limpiar:", localStorage.getItem("cedulaRepartidor"));
        console.log("Rol tras limpiar:", localStorage.getItem("rolSonic"));

        // 3. Alerta con SweetAlert2 y redirección segura al login
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
    // Redirige de forma absoluta usando el origen del servidor local, evitando errores por subcarpetas
    window.location.href = window.location.origin + "/sonic_delivery/iniciosesion.html";
}

// Ejecutar al cargar la página y repetir cada 4 segundos
document.addEventListener('DOMContentLoaded', () => {
    cargarPedidosDisponibles();
    setInterval(cargarPedidosDisponibles, 4000);
});
console.log("¡pedidosajax.js se cargó por completo en el Panel Admin!");