document.querySelector("form").addEventListener("submit", function(event) {  

    let nombre_repartidor = document.getElementById("nombre_repartidor").value.trim();
    let contraseña_repartidor = document.getElementById("contrasena_repartidor").value.trim();

    // 1. Validar campos vacíos
    if (!nombre_repartidor || !contraseña_repartidor) {
        event.preventDefault();
        Swal.fire({
            icon: "error",
            title: "No pueden haber campos vacios",
            showConfirmButton: true
        });
        return;
    }

    // 2. Validar que el nombre tenga solo letras
    if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre_repartidor)) {
        event.preventDefault();
        Swal.fire({
            title: "El nombre debe contener solo letras",
            icon: "error"
        });
        return;
    }

    // 3. Validar contraseña robusta
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(contraseña_repartidor)) {
        event.preventDefault();
        Swal.fire({
            title: "La contraseña debe contener letras, números y caracteres especiales",
            icon: "error"
        });
        return;
    }

    // =========================================================================
    // 4. GUARDAR SESIÓN Y DAR ACCESO EXITOSO
    // =========================================================================
    localStorage.setItem("rolSonic", "repartidor");
    localStorage.setItem("nombreRepartidor", nombre_repartidor);

    // Opcional: Si manejas el login de forma interna con JS y quieres mostrar la alerta bonita antes de entrar:
    // event.preventDefault(); // (Descomenta esto si quieres hacer la transición con SweetAlert)

    Swal.fire({
        icon: "success",
        title: "¡Bienvenido, " + nombre_repartidor + "!",
        text: "Has iniciado sesión correctamente.",
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        window.location.href = "pedidosD.html"; // Redirigir a pedidos disponibles
    });
});