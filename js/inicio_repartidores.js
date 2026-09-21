function validarInformacion() {
    let nombre_domicilirio = document.getElementById("nom").value;
    let contrasena = document.getElementById("cont").value;
    


    if (!nombre_domicilirio || !contrasena ) {
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
            ${nombre_domicilirio} \n
            ${contrasena}`
        );
    }


if (!/^[a-zA-Z]+$/.test(nombre_domicilirio)) {
    console.log("nombre debe contener solo letras")
    Swal.fire({
        title: "nombre debe contener ",
        icon: "error"
    });
    return;
}

if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(contrasena)) {
    console.log("La contraseña debe contener solo letras y números");
    Swal.fire({
        title: " debe contener letras y números",
        icon: "error"
    });
    return;
}
}


document.getElementById("guardar").onclick = validarInformacion;