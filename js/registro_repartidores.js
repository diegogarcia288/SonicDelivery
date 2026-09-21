function validarInformacion() {
    let nombre_domicilirio = document.getElementById("hhh").value;
    let contrasena = document.getElementById("tras").value;
    let rein = document.getElementById("gis").value;
    let telefono = document.getElementById("cel").value;
    let identi = document.getElementById("iden").value;


    if (!nombre_domicilirio || !contrasena || !rein || !telefono || !identi) {
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
            ${rein} \n
            ${telefono} \n
            ${identi} \n
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

if (!/^\d+$/.test(telefono)) {
    console.log("el telefono debe contener solo números")
    Swal.fire({
        title: "telefono debe contener ",
        icon: "error"
    });
    return;
}

if (!/^\d+$/.test(identi)) {
    console.log("La cedula debe contener solo números");
    Swal.fire({
        title: " debe contener números",
        icon: "error"
    });
    return;
}

}


document.getElementById("guardar").onclick = validarInformacion;