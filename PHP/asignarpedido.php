// Función para renderizar pedidos dinámicamente
function cargarPedidosEnVista(urlPhp, contenedorId, mostrarBotonAccion = false, datosExtra = {}) {
    
    // Configuramos los datos a enviar (por ejemplo, el comercio si aplica)
    let opciones = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };

    if (Object.keys(datosExtra).length > 0) {
        opciones.body = new URLSearchParams(datosExtra);
    }

    fetch(urlPhp, opciones)
        .then(response => response.json())
        .then(pedidos => {
            const contenedor = document.getElementById(contenedorId);
            if (!contenedor) return;
            
            contenedor.innerHTML = "";

            if (pedidos.length === 0) {
                contenedor.innerHTML = "<p>No hay pedidos registrados en este momento.</p>";
                return;
            }

            pedidos.forEach(pedido => {
                let htmlBoton = "";
                
                // Si la vista permite tomar pedido (como el repartidor), se añade el botón
                if (mostrarBotonAccion) {
                    htmlBoton = `<button class="btn btn-primary btn-tomar mt-2" data-id="${pedido.ID_pedido}">Tomar Pedido</button>`;
                }

                contenedor.innerHTML += `
                    <div class="card mb-3 p-3 shadow-sm">
                        <h5>Pedido #${pedido.ID_pedido}</h5>
                        <p><strong>Comercio:</strong> ${pedido.comercioP}</p>
                        <p><strong>Detalle:</strong> ${pedido.detalle}</p>
                        <p><strong>Dirección:</strong> ${pedido.direccion}</p>
                        <p><strong>Estado:</strong> <span class="badge bg-secondary">${pedido.estado}</span></p>
                        <p><strong>Repartidor Asignado:</strong> ${pedido.CedulaR ? pedido.CedulaR : 'Ninguno'}</p>
                        ${htmlBoton}
                    </div>
                `;
            });
        })
        .catch(error => console.error("Error al cargar los pedidos:", error));
}