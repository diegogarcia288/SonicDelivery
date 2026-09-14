function validarInformacion() {
    let nombre_administrador= document.getElementById("nombre_administrador").value;
    let contraseña_administrador = document.getElementById("contraseña_administrador").value;
    let cant_producto = document.getElementById("cant_producto").value;
    let descripcion_producto = document.getElementById("descripcion_producto").value;
    let marca_producto = document.getElementById("marca_producto").value;
    let valor_uni = document.getElementById("valor_uni").value;
    let categoria_producto = document.getElementById("categoria_producto").value;
    let ubi_producto = document.getElementById("ubi_producto").value;
    

    if (!nombre_administrador || !contraseña_administrador || !cant_producto || !descripcion_producto || !marca_producto || !valor_uni || !categoria_producto || !ubi_producto) {
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
            ${contraseña_administrador} \n
            ${cant_producto} \n
            ${descripcion_producto} \n
            ${marca_producto} \n
            ${valor_uni} \n
            ${categoria_producto} \n
            ${ubi_producto}`
        );
    }

    if (!/^\d+$/.test(cod_producto)) {
        console.log("Valor debe contener números")
        Swal.fire({
            title: "Valor debe contener números",
            icon: "error"
        });
        return;
    }
    if (!/^[a-zA-Z]+$/.test(contraseña_administrador)) {
        console.log("Contraseña debe contener letras")
        Swal.fire({
            title: "Contraseña debe contener ",
            icon: "error"
        });
        return;
    }
    if (!/^\d+$/.test(cant_producto)) {
        console.log("Valor debe contener números")
        Swal.fire({
            title: "Valor debe contener números",
            icon: "error"
        });
        return;
    }
    if (!/^[a-zA-Z]+$/.test(descripcion_producto)) {
        console.log("Descripcion debe contener letras")
        Swal.fire({
            title: "Descripcion debe contener letras",
            icon: "error"
        });
        return;
    }
    if (!/^[a-zA-Z]+$/.test(marca_producto)) {
        console.log("Marca debe contener letras")
        Swal.fire({
            title: "Marca debe contener letras",
            icon: "error"
        });
        return;
    }
    if (!/^\d+$/.test(valor_uni)) {
        console.log("Valor Unitario debe contener números")
        Swal.fire({
            title: "Valor Unitario debe contener números",
            icon: "error"
        });
        return;
    }
    if (!/^[a-zA-Z]+$/.test(categoria_producto)) {
        console.log("Categoria debe contener letras")
        Swal.fire({
            title: "Categoria debe contener letras",
            icon: "error"
        });
        return;
    }
    if (!/^[a-zA-Z]+$/.test(ubi_producto)) {
        console.log("Ubicacion debe contener letras")
        Swal.fire({
            title: "Ubicacion debe contener letras",
            icon: "error"
        });
        return;
    }
        return;
    

    {
    Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Informacion Guardada Correctamente",
            showConfirmButton: false,
            timer: 1500
        });
    }
}
document.getElementById("guardar").onclick = validarInformacion;