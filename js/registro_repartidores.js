function validarInformacion(event) {
    event.preventDefault();

    let nombre_repartidor = document.getElementById("nombre_repartidor").value.trim();
    let contraseña_repartidor = document.getElementById("contrasena_repartidor").value.trim(); // <-- Ajustado sin eñe
    let telefono_repartidor = document.getElementById("telefono_repartidor").value.trim();
    let cedula_repartidor = document.getElementById("cedula_repartidor").value.trim();


    if (!nombre_repartidor || !contraseña_repartidor || !telefono_repartidor || !cedula_repartidor) {
        Swal.fire({
            icon: "error",
            title: "No pueden haber campos vacios",
            showConfirmButton: true
        });
        return;
    }

    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre_repartidor)) {
        console.log("Nombre debe contener letras");
        Swal.fire({
            title: "El nombre debe contener solo letras",
            icon: "error"
        });
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(contraseña_repartidor)) {
        console.log("contraseña repartidor debe contener letras, números y caracteres especiales");
        Swal.fire({
            title: "La contraseña debe contener letras, números y caracteres especiales",
            icon: "error"
        });
        return;
    }

    if (!/^\d+$/.test(telefono_repartidor)) {
        console.log("telefono debe contener solo números");
        Swal.fire({
            title: "El teléfono debe contener solo números",
            icon: "error"
        });
        return;
    }

    if (!/^\d+$/.test(cedula_repartidor)) {
        console.log("cedula debe contener números");
        Swal.fire({
            title: "La cédula debe contener solo números",
            icon: "error"
        });
        return;
    }

    console.log(
        `Informacion del repartidor: \n` +
        `${nombre_repartidor} \n` +
        `${contraseña_repartidor} \n` +
        `${telefono_repartidor} \n` +
        `${cedula_repartidor}`
    );
}

document.getElementById("guardar").onclick = validarInformacion;
