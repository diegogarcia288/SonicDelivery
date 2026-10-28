document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Detectar si el PHP redirigió con ?exito=1 para mostrar la alerta de éxito
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('exito') === '1') {
        Swal.fire({
            icon: "success",
            title: "¡Pedido realizado con éxito!",
            text: "El pedido ha sido registrado y ya está disponible para los repartidores.",
            confirmButtonText: "Aceptar"
        }).then(() => {
            // Limpiar la URL para que la alerta no vuelva a salir si recargan la página
            window.history.replaceState({}, document.title, window.location.pathname);
        });
    }

    // 2. Validación del formulario antes de enviarlo
    const formulario = document.querySelector("form");

    if (formulario) {
        formulario.addEventListener("submit", function(event) {
            let detalles = document.getElementById("Detalles").value.trim();
            let direccion = document.getElementById("Direccion").value.trim();
            let comercio = document.getElementById("Comercio").value.trim();

            // Validación de campos vacíos
            if (detalles === "" || direccion === "" || comercio === "") {
                event.preventDefault();
                Swal.fire({
                    icon: "error",
                    title: "No pueden haber campos vacíos",
                    showConfirmButton: true
                });
                return;
            }

            // Validación de longitud de detalles
            if (detalles.length < 3) {
                event.preventDefault();
                Swal.fire({
                    icon: "error",
                    title: "El detalle es muy corto (mínimo 3 caracteres)"
                });
                return;
            }

            // Validación de dirección
            if (direccion.length < 5) {
                event.preventDefault();
                Swal.fire({
                    icon: "error",
                    title: "La dirección es muy corta (mínimo 5 caracteres)"
                });
                return;
            }

            // Validación de comercio
            if (comercio.length < 2) {
                event.preventDefault();
                Swal.fire({
                    icon: "error",
                    title: "El nombre del comercio es muy corto"
                });
                return;
            }
        });
    }
});