function validarInformacion(event) {
    event.preventDefault();

    let detalles_pedido = document.getElementById("email").value.trim();
    let direccion_pedido = document.getElementById("direccion").value.trim();

    if (!detalles_pedido || !direccion_pedido) {
        Swal.fire({
            icon: "error",
            title: "No pueden haber campos vacios",
            showConfirmButton: true
        });
        return;
    }

    console.log(
        `Informacion del pedido: \n${detalles_pedido} \n${direccion_pedido}`
    );
}

document.getElementById("guardar").onclick = validarInformacion;