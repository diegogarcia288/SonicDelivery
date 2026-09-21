function validarInformacion() {
    let nombre_comercio= document.getElementById("nombre_comercio").value;
    let nit_comercio= document.getElementById("nit_comercio").value;
    let contraseña_comercio = document.getElementById("contrasena_comercio").value;
    let direccion_comercio = document.getElementById("direccion_comercio").value;
    let correo_comercio = document.getElementById("correo_comercio").value;

    if (!nombre_comercio || !nit_comercio || !contraseña_comercio || !direccion_comercio || !correo_comercio ) {
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
            `Informacion del Comercio: \n
            ${nombre_comercio} \n
            ${nit_comercio} \n
            ${contraseña_comercio} \n
            ${direccion_comercio} \n
            ${correo_comercio}`
        );

    }

    

        if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre_comercio)) {
            console.log("Nombre debe contener letras")
            Swal.fire({
                title: "Nombre debe contener letras",
                icon: "error"
            });
            return;
        }

        if (!/^\d+$/.test(nit_comercio)) {
            console.log("NIT debe contener solo números")
            Swal.fire({
                title: "NIT debe contener solo números",
                icon: "error"
            });
            return;
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(contraseña_comercio)) {
            console.log("contraseña comercio debe contener letras, números y guiones bajos")
            Swal.fire({
                title: "contraseña comercio debe contener letras, números y guiones bajos",
                icon: "error"
            });
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$$/.test(correo_comercio)) {
            console.log("El correo debe contener @")
            Swal.fire({
                title: "correo debe contener @",
                icon: "error"
            });
            return;
        }
        
}
document.getElementById("guardar").onclick = validarInformacion;
