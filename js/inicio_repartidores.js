function validarInformacion(event) {
    event.preventDefault();

    let nombre_repartidor = document.getElementById("nombre_repartidor").value.trim();
    let contraseña_repartidor = document.getElementById("contrasena_repartidor").value.trim();

    if (!nombre_repartidor || !contraseña_repartidor) {
        Swal.fire({
            icon: "error",
            title: "No pueden haber campos vacios",
            showConfirmButton: true
        });
        return;
    }

    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre_repartidor)) {
        console.log("nombre debe contener solo letras");
        Swal.fire({
            title: "El nombre debe contener solo letras",
            icon: "error"
        });
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(contraseña_repartidor)) {
        console.log("La contraseña debe contener letras, números y caracteres especiales");
        Swal.fire({
            title: "La contraseña debe contener letras, números y caracteres especiales",
            icon: "error"
        });
        return;
    }

    console.log(
        `Informacion del repartidor: \n${nombre_repartidor} \n${contraseña_repartidor}`
    );
}

document.getElementById("guardar").onclick = validarInformacion;