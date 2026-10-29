document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.querySelector("form");

    if (formulario) {
        formulario.addEventListener("submit", function(event) {
            let detalles_pedido = document.getElementById("Detalles").value.trim();
            let direccion_pedido = document.getElementById("Direccion").value.trim();
            let comercio_pedido = document.getElementById("Comercio").value.trim();

            // 1. Validar campos obligatorios (Dirección y Comercio). 'Detalles' ya no es obligatorio.
            if (!direccion_pedido || !comercio_pedido) {
                event.preventDefault();
                Swal.fire({
                    icon: "error",
                    title: "La dirección y el comercio son obligatorios",
                    showConfirmButton: true
                });
                return;
            }

            // 2. Validar detalles SOLO SI el usuario escribió algo en él (opcional)
            if (detalles_pedido !== "" && detalles_pedido.length < 3) {
                event.preventDefault();
                Swal.fire({
                    icon: "error",
                    title: "El detalle debe tener al menos 3 caracteres"
                });
                return;
            }

            // 3. Validar formato de dirección (con el formato que te funciona)
            let regexCaracteresValidos = /^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ#\-\s\.]+$/;

            if (!regexCaracteresValidos.test(direccion_pedido) || 
                !direccion_pedido.includes('#') || 
                !direccion_pedido.includes('-') || 
                direccion_pedido.length < 5) {
                
                event.preventDefault();
                Swal.fire({
                    icon: "error",
                    title: "Debe especificarse una dirección válida",
                    text: "Ejemplo: Cra 9#35b-4 o Calle 9#35-4"
                });
                return;
            }

            // 4. Validar comercio (mínimo 2 caracteres)
            if (comercio_pedido.length < 2) {
                event.preventDefault();
                Swal.fire({
                    icon: "error",
                    title: "Debe especificarse un comercio válido"
                });
                return;
            }
        });
    }
});