function validarInformacion() {
    let nombre_administrador= document.getElementById("nombre_administrador").value;
    let contraseña_administrador = document.getElementById("contraseña_administrador").value;
    

    if (!nombre_administrador || !contraseña_administrador) {
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
            ${nombre_administrador} \n
            ${contraseña_administrador}`
        );
    }

    }
    if (!/^[a-zA-Z]+$/.test(nombre_administrador)) {
        console.log("nombre debe contener solo letras")
        Swal.fire({
            title: "nombre debe contener ",
            icon: "error"
        });
        return;
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(contraseña_administrador)) {
        console.log("La contraseña debe contener solo letras y números");
        Swal.fire({
             title: " debe contener letras y números",
             icon: "error"
    });
    return; 
}

    

document.getElementById("guardar").onclick = validarInformacion;