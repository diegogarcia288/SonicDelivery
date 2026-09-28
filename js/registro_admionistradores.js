function validarInformacion(event) {
    event.preventDefault();

    let nombre_administrador = document.getElementById("nombre_administrador").value.trim();
    let cedula_administrador = document.getElementById("cedula_administrador").value.trim();
    let contraseña_administrador = document.getElementById("contraseña_administrador").value.trim();
    let telefono_administrador = document.getElementById("telefono_administrador").value.trim();

    if (!nombre_administrador || !cedula_administrador || !contraseña_administrador || !telefono_administrador) {
        Swal.fire({
            icon: "error",
            title: "No pueden haber campos vacios",
            showConfirmButton: true
        });
        return;
    }

    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre_administrador)) {
        console.log("Nombre debe contener letras");
        Swal.fire({
            title: "El nombre debe contener solo letras",
            icon: "error"
        });
        return;
    }

    if (!/^\d+$/.test(cedula_administrador)) {
        console.log("Cédula debe contener números");
        Swal.fire({
            title: "La cédula debe contener solo números",
            icon: "error"
        });
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(contraseña_administrador)) {
        console.log("contraseña administrador debe contener letras, números y caracteres especiales");
        Swal.fire({
            title: "La contraseña debe contener letras, números y caracteres especiales",
            icon: "error"
        });
        return;
    }

    if (!/^\d+$/.test(telefono_administrador)) {
        console.log("telefono debe contener solo números");
        Swal.fire({
            title: "El teléfono debe contener solo números",
            icon: "error"
        });
        return;
    }

    console.log(
        `Informacion del administrador: \n` +
        `${nombre_administrador} \n` +
        `${cedula_administrador} \n` +
        `${contraseña_administrador} \n` +
        `${telefono_administrador}`
    );
}

document.getElementById("guardar").onclick = validarInformacion;
