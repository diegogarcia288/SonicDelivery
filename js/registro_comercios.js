document.querySelector("form").addEventListener("submit", function(event) {
    let nombre_comercio = document.getElementById("nombre_comercio").value.trim();
    let nit_comercio = document.getElementById("nit_comercio").value.trim();
    let contraseña_comercio = document.getElementById("contrasena_comercio").value.trim();
    let direccion_comercio = document.getElementById("direccion_comercio").value.trim();
    let correo_comercio = document.getElementById("correo_comercio").value.trim();

    if (!nombre_comercio || !nit_comercio || !contraseña_comercio || !direccion_comercio || !correo_comercio) {
        event.preventDefault();
        Swal.fire({
            icon: "error",
            title: "No pueden haber campos vacios",
            showConfirmButton: true
        });
        return; 
    }

    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre_comercio)) {
        event.preventDefault();
        Swal.fire({
            title: "El nombre debe contener solo letras",
            icon: "error"
        });
        return;
    }

    if (!/^\d+$/.test(nit_comercio)) {
        event.preventDefault();
        Swal.fire({
            title: "El NIT debe contener solo números",
            icon: "error"
        });
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(contraseña_comercio)) {
        event.preventDefault();
        Swal.fire({
            title: "La contraseña debe contener letras, números y caracteres especiales",
            icon: "error"
        });
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(direccion_comercio)) {
        event.preventDefault();
        Swal.fire({
            title: "La dirección debe contener letras, números y caracteres especiales",
            icon: "error"
        });
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo_comercio)) {
        event.preventDefault();
        Swal.fire({
            title: "El correo debe tener un formato válido",
            icon: "error"
        });
        return;
    }
    });
