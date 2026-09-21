function validarInformacion() {
    let nombre_comercio= document.getElementById("nombre_comercio").value;
    let contraseña_comercio = document.getElementById("contrasena_comercio").value;
    

    if (!nombre_comercio || !contraseña_comercio) {
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
            `Informacion del comercio: \n
            ${nombre_comercio} \n
            ${contraseña_comercio}`
        );
    }

    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre_comercio)) {
        console.log("nombre debe contener solo letras")
        Swal.fire({
            title: "nombre debe contener ",
            icon: "error"
        });
        return;
    }
    
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(contraseña_comercio)) {
        console.log("La contraseña debe contener solo letras y números");
        Swal.fire({
             title: "La contraseña debe contener letras y números",
             icon: "error"
    });
    return; 
}   

document.getElementById("guardar").onclick = validarInformacion;}