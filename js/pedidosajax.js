function cargarPedidosDisponibles() {
    // IMPORTANTE: Asegúrate de que la ruta a 'obtener_pedidos.php' sea correcta 
    // dependiendo de dónde esté guardado este archivo con respecto al PHP.
    fetch('../PHP/obtener_pedidos.php')
        .then(response => response.json())
        .then(data => {
            let contenedor = document.getElementById('lista-pedidos');
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
                    </div>
                `;
                contenedor.innerHTML += tarjeta;
            });
        })
        .catch(error => console.error('Error al actualizar los pedidos:', error));
}

// Ejecutar al cargar la página y repetir cada 4 segundos
document.addEventListener('DOMContentLoaded', () => {
    cargarPedidosDisponibles();
    setInterval(cargarPedidosDisponibles, 4000);
});