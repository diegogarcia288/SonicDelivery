document.querySelector("form").addEventListener("submit", function(event) {
    let cedula = document.getElementById("cedula_administrador").value.trim();
    let password = document.getElementById("contraseña_administrador").value.trim();

    if (!cedula || !password) {
        event.preventDefault();
        Swal.fire({
            icon: "error",
            title: "No pueden haber campos vacios",
            showConfirmButton: true
        });
        return;
    }

    if (!/^\d+$/.test(cedula)) {
        event.preventDefault();
        Swal.fire({
            title: "La cédula debe contener solo números",
            icon: "error"
        });
        return;
    }
});