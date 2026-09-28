function validarInformacion(event) {
    // Evita que el formulario se recargue automáticamente
    event.preventDefault();

    let nombre_comercio = document.getElementById("nombre_comercio").value.trim();
    let contraseña_comercio = document.getElementById("contrasena_comercio").value.trim();

    if (!nombre_comercio || !contraseña_comercio) {
        Swal.fire({
            icon: "error",
            title: "No pueden haber campos vacios",
            showConfirmButton: true
        });
        return;
    }

    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre_comercio)) {
        console.log("nombre debe contener solo letras");
        Swal.fire({
            title: "El nombre debe contener solo letras",
            icon: "error"
        });
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(contraseña_comercio)) {
        console.log("La contraseña debe contener letras, números y caracteres especiales");
        Swal.fire({
            title: "La contraseña debe contener letras, números y caracteres especiales",
            icon: "error"
        });
        return;
    }

    console.log(
        `Informacion del comercio: \n${nombre_comercio} \n${contraseña_comercio}`
    );
}

document.getElementById("guardar").onclick = validarInformacion;