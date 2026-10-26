document.querySelector("form").addEventListener("submit", function(event) {
    let detalles_pedido = document.getElementById("Detalles").value.trim();
    let direccion_pedido = document.getElementById("Direccion").value.trim();
    let comercio_pedido = document.getElementById("Comercio").value.trim();

    if (!detalles_pedido || !direccion_pedido || !comercio_pedido) {
        Swal.fire({
            icon: "error",
            title: "No pueden haber campos vacios",
            showConfirmButton: true
        });
        return;
    }

    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(Detalles)) {
        event.preventDefault();
        Swal.fire({
            title: "Deben darse detalles del pedido",
            icon: "error"
        });
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(Direccion)) {
        event.preventDefault();
        Swal.fire({
            title: "Debe especificarse la dirección del pedido",
            icon: "error"
        });
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(Comercio)) {
        event.preventDefault();
        Swal.fire({
            title: "Debe especificarse el comercio del pedido",
            icon: "error"
        });
        return;
    }
})