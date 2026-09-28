function validarInformacion() {
    let nombre_repartidor= document.getElementById("nombre_repartidor").value;
    let contraseña_repartidor= document.getElementById("contraseña_repartidor").value;
    let telefono_repartidor = document.getElementById("telefono_repartidor").value;
    let cedula_repartidor = document.getElementById("cedula_repartidor").value;

    if (!nombre_repartidor || !contraseña_repartidor || !telefono_repartidor || !cedula_repartidor) {
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
            ${nombre_repartidor} \n
            ${contraseña_repartidor} \n
            ${telefono_repartidor} \n
            ${cedula_repartidor}`
        );

    }

    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre_repartidor)) {
            console.log("Nombre debe contener letras")
            Swal.fire({
                title: "Nombre debe contener letras",
                icon: "error"
            });
            return;
        }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(contraseña_repartidor)) {
            console.log("contraseña repartidor debe contener letras, números y guiones bajos")
            Swal.fire({
                title: "contraseña repartidor debe contener letras, números y guiones bajos",
                icon: "error"
            });
            return;
        }


    if (!/^\d+$/.test(telefono_repartidor)) {
            console.log("telefono debe contener solo números")
            Swal.fire({
                title: "telefono debe contener solo números",
                icon: "error"
            });
            return;
        }    



    if (!/^\d+$/.test(cedula_repartidor)) {
            console.log("cedula debe contener números")
            Swal.fire({
                title: "cedula debe contener números",
                icon: "error"
            });
            return;
    }
        
        
}
document.getElementById("guardar").onclick = validarInformacion;
