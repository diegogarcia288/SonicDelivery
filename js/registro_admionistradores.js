document.querySelector("form").addEventListener("submit", function(event) {
    let nombre = document.getElementById("nombre_administrador").value.trim();
    let cedula = document.getElementById("cedula_administrador").value.trim();
    let password = document.getElementById("contraseña_administrador").value.trim();
    let telefono = document.getElementById("telefono_administrador").value.trim();

    // Validar campos vacíos
    if (!nombre || !cedula || !password || !telefono) {
        event.preventDefault();
        Swal.fire({
            icon: "error",
            title: "No pueden haber campos vacios",
            showConfirmButton: true
        });
        return;
    }

    // Validar nombre (solo letras)
    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre)) {
        event.preventDefault();
        Swal.fire({
            title: "El nombre debe contener solo letras",
            icon: "error"
        });
        return;
    }

    // Validar cédula (solo números)
    if (!/^\d+$/.test(cedula)) {
        event.preventDefault();
        Swal.fire({
            title: "La cédula debe contener solo números",
            icon: "error"
        });
        return;
    }

    // Validar contraseña (letras, números y especiales, mín. 8 caracteres)
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
        event.preventDefault();
        Swal.fire({
            title: "La contraseña debe contener letras, números y caracteres especiales",
            icon: "error"
        });
        return;
    }

    // Validar teléfono (solo números)
    if (!/^\d+$/.test(telefono)) {
        event.preventDefault();
        Swal.fire({
            title: "El teléfono debe contener solo números",
            icon: "error"
        });
        return;
    }

    // Si todo está correcto, no ponemos event.preventDefault() 
    // y el formulario se enviará de forma nativa a tu PHP.
});