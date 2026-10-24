document.querySelector("form").addEventListener("submit", function(event) {   
    let usuario_comercio = document.getElementById("nombre_comercio").value.trim();
    let contraseña_comercio = document.getElementById("contrasena_comercio").value.trim();

    if (!usuario_comercio || !contraseña_comercio) {
        event.preventDefault();
        Swal.fire({
            icon: "error",
            title: "No pueden haber campos vacios",
            showConfirmButton: true
        });
        return;
    }
});