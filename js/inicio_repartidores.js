document.querySelector("form").addEventListener("submit", function(event) {  

    let nombre_repartidor = document.getElementById("nombre_repartidor").value.trim();
    let contraseña_repartidor = document.getElementById("contrasena_repartidor").value.trim();

    if (!nombre_repartidor || !contraseña_repartidor) {
        event.preventDefault();
        Swal.fire({
            icon: "error",
            title: "No pueden haber campos vacios",
            showConfirmButton: true
        });
        return;
    }

    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre_repartidor)) {
        event.preventDefault();
        Swal.fire({
            title: "El nombre debe contener solo letras",
            icon: "error"
        });
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(contraseña_repartidor)) {
        event.preventDefault();
        Swal.fire({
            title: "La contraseña debe contener letras, números y caracteres especiales",
            icon: "error"
        });
        return;
    }
    })