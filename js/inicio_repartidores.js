function validarInformacion() {

    let nombre_repartidor = document.getElementById("nombre_repartidor").value;
    let contraseña_repartidor = document.getElementById("contraseña_repartidor").value;


    if (!nombre_repartidor|| !contraseña_repartidor) {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Campos Incompletos",
            showConfirmButton: false,
            timer: 1500
        });
    }
    else {
        console.log(
            `Informacion del admin: \n
            ${nombre_repartidor} \n
            ${contraseña_repartidor}`
        );
    }


    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre_repartidor)) {
        console.log("nombre debe contener solo letras")
        Swal.fire({
            title: "nombre debe contener ",
            icon: "error"
        });
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(contraseña_repartidor)) {
        console.log("La contraseña debe contener solo letras y números");
        Swal.fire({
            title: "La contraseña debe contener letras y números",
            icon: "error"
        });
        return;
    }
}


document.getElementById("guardar").onclick = validarInformacion;