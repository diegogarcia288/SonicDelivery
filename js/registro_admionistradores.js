function validarInformacion() {
    let nombre_administrador= document.getElementById("nombre_administrador").value;
    let cedula_administrador= document.getElementById("cedula_administrador").value;
    let contraseña_administrador = document.getElementById("contraseña_administrador").value;
    let telefono_administrador = document.getElementById("telefono_administrador").value;

    if (!nombre_administrador || !cedula_administrador || !contraseña_administrador || !telefono_administrador ) {
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
            `Informacion del Producto: \n
            ${nombre_administrador} \n
            ${cedula_administrador} \n
            ${contraseña_administrador} \n
            ${telefono_administrador}`
        );

    }

    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre_administrador)) {
            console.log("Nombre debe contener letras")
            Swal.fire({
                title: "Nombre debe contener letras",
                icon: "error"
            });
            return;
        }

    if (!/^\d+$/.test(cedula_administrador)) {
            console.log("Valor debe contener números")
            Swal.fire({
                title: "Valor debe contener números",
                icon: "error"
            });
            return;
    }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(contraseña_administrador)) {
            console.log("contraseña administrador debe contener letras, números y guiones bajos")
            Swal.fire({
                title: "contraseña administrador debe contener letras, números y guiones bajos",
                icon: "error"
            });
            return;
        }
        
    if (!/^\d+$/.test(telefono_administrador)) {
            console.log("telefono debe contener solo números")
            Swal.fire({
                title: "telefono debe contener solo números",
                icon: "error"
            });
            return;
        }
        
}
document.getElementById("guardar").onclick = validarInformacion;
