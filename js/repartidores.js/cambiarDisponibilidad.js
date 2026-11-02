function cambiarDisponibilidad(estadoAccion) {
    let cedulaRepartidor = localStorage.getItem("cedulaRepartidor");

    if (!cedulaRepartidor) {
        Swal.fire("Error", "No se encontró la cédula en la sesión. Inicia sesión nuevamente.", "error");
        return;
    }

    // Obtenemos el estado actual guardado en el navegador
    let estadoActual = localStorage.getItem("estadoRepartidor") || "";

    // VALIDACIÓN: Si ya está en el estado que quiere activar, evitamos el proceso y mostramos advertencia
    if (estadoActual.toLowerCase() === estadoAccion.toLowerCase()) {
        if (estadoAccion === 'activo') {
            Swal.fire("Información", "Ya te encuentras activo para recibir pedidos.", "info");
        } else {
            Swal.fire("Información", "Ya te encuentras desactivado.", "info");
        }
        return;
    }

    let estadoBD = (estadoAccion === 'activo') ? 'Activo' : 'Inactivo';

    fetch(window.location.origin + "/sonic_delivery/PHP/repartidoresPHP/actualizarestado.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `cedula=${cedulaRepartidor}&estado=${estadoBD}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.exito) {
            // Sincronizamos el estado en el almacenamiento local del navegador
            localStorage.setItem("estadoRepartidor", estadoAccion);

            if (estadoAccion === 'activo') {
                Swal.fire({
                    icon: "success",
                    title: "¡Conectado!",
                    text: "Ahora estás activo para recibir nuevos pedidos.",
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: "info",
                    title: "¡Desconectado!",
                    text: "Te has desactivado. Ya no recibirás más pedidos por ahora.",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } else {
            Swal.fire("Error", data.mensaje || "No se pudo actualizar el estado.", "error");
        }
    })
    .catch(error => {
        console.error("Error al cambiar estado:", error);
        Swal.fire("Error de conexión", "No se pudo comunicar con el servidor.", "error");
    });
}function cambiarDisponibilidad(estadoAccion) {
    let cedulaRepartidor = localStorage.getItem("cedulaRepartidor");

    if (!cedulaRepartidor) {
        Swal.fire("Error", "No se encontró la cédula en la sesión. Inicia sesión nuevamente.", "error");
        return;
    }

    // Obtenemos el estado actual guardado en el navegador
    let estadoActual = localStorage.getItem("estadoRepartidor") || "";

    // VALIDACIÓN: Si ya está en el estado que quiere activar, evitamos el proceso y mostramos advertencia
    if (estadoActual.toLowerCase() === estadoAccion.toLowerCase()) {
        if (estadoAccion === 'activo') {
            Swal.fire("Información", "Ya te encuentras activo para recibir pedidos.", "info");
        } else {
            Swal.fire("Información", "Ya te encuentras desactivado.", "info");
        }
        return;
    }

    let estadoBD = (estadoAccion === 'activo') ? 'Activo' : 'Inactivo';

    fetch(window.location.origin + "/sonic_delivery/PHP/repartidoresPHP/actualizarestado.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `cedula=${cedulaRepartidor}&estado=${estadoBD}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.exito) {
            // Sincronizamos el estado en el almacenamiento local del navegador
            localStorage.setItem("estadoRepartidor", estadoAccion);

            if (estadoAccion === 'activo') {
                Swal.fire({
                    icon: "success",
                    title: "¡Conectado!",
                    text: "Ahora estás activo para recibir nuevos pedidos.",
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: "info",
                    title: "¡Desconectado!",
                    text: "Te has desactivado. Ya no recibirás más pedidos por ahora.",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } else {
            Swal.fire("Error", data.mensaje || "No se pudo actualizar el estado.", "error");
        }
    })
    .catch(error => {
        console.error("Error al cambiar estado:", error);
        Swal.fire("Error de conexión", "No se pudo comunicar con el servidor.", "error");
    });
}