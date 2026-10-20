function validarInformacion(event) {
    event.preventDefault();

    let nombre_administrador = document.getElementById("nombre_administrador").value.trim();
    let contraseña_administrador = document.getElementById("contraseña_administrador").value.trim();

    if (!nombre_administrador || !contraseña_administrador) {
        Swal.fire({
            icon: "error",
            title: "No pueden haber campos vacios",
            showConfirmButton: true
        });
        return;
    }

    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre_administrador)) {
        Swal.fire({
            title: "El nombre debe contener solo letras",
            icon: "error"
        });
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(contraseña_administrador)) {
        Swal.fire({
            title: "La contraseña debe contener letras, números y caracteres especiales",
            icon: "error"
        });
        return;
    }

    console.log(
        `Informacion del admin: \n${nombre_administrador} \n${contraseña_administrador}`
    );

    Swal.fire({
        icon: "success",
        title: "El admin fue registrado con éxito, BIENVENIDO.",
        showConfirmButton: false,
        timer: 2000
    })
}

document.getElementById("guardar").addEventListener("click", function(Event) {
    validarInformacion(Event);
})