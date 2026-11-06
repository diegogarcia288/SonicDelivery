document.addEventListener("DOMContentLoaded", function() {
    
    // --- LÓGICA DEL FORMULARIO DE LOGIN / ENVÍO DE CREDENCIALES ---
    const formLogin = document.getElementById("formLogin");

    if (formLogin) {
        formLogin.addEventListener("submit", function(e) {
            e.preventDefault();

            // Obtenemos el rol activo o seleccionado de forma segura
            let rolSelectElement = document.getElementById("rolSelect");
            let rolSeleccionado = localStorage.getItem("rolSonic") || (rolSelectElement ? rolSelectElement.value : "");
            
            let cedula = document.getElementById("cedula").value;
            let password = document.getElementById("password").value;

            // Determinar a qué archivo PHP apuntar según el rol
            let urlDestino = "";
            if (rolSeleccionado === "administrador") {
                urlDestino = window.location.origin + '/sonic_delivery/PHP/administradorPHP/verificarAdmin.php';
            } else if (rolSeleccionado === "comercio") {
                urlDestino = window.location.origin + '/sonic_delivery/PHP/comercioPHP/verificarComercio.php';
            } else if (rolSeleccionado === "repartidor") {
                urlDestino = window.location.origin + '/sonic_delivery/PHP/repartidoresPHP/verificarRepartidor.php';
            }

            // Petición de verificación al servidor
            fetch(urlDestino, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `cedula=${encodeURIComponent(cedula)}&password=${encodeURIComponent(password)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem("rolSonic", rolSeleccionado);
                    Swal.fire({
                        icon: 'success',
                        title: '¡Bienvenido!',
                        text: 'Has iniciado sesión correctamente.',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        redirigirAlPanel(rolSeleccionado);
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de acceso',
                        text: data.message || 'Credenciales incorrectas.',
                        confirmButtonText: 'Intentar de nuevo'
                    });
                }
            })
            .catch(error => {
                console.error('Error en la autenticación:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor.',
                    confirmButtonText: 'Entendido'
                });
            });
        });
    }

    // --- VALIDACIÓN DE SESIÓN EXISTENTE ---
    let rolActivo = localStorage.getItem("rolSonic");
    if (rolActivo && window.location.pathname.includes("iniciosesion.html")) {
        redirigirAlPanel(rolActivo);
        return;
    }

    // --- LÓGICA DEL MENÚ DESPLEGABLE Y REDIRECCIÓN AL LOGIN ---
    const btnContinuar = document.getElementById("btnContinuar");

    if (btnContinuar) {
        btnContinuar.addEventListener("click", function() {
            let rolSelect = document.getElementById("rolSelect");
            let rolSeleccionado = rolSelect ? rolSelect.value : "";

            if (!rolSeleccionado) {
                Swal.fire({
                    icon: "warning",
                    title: "Selección requerida",
                    text: "Por favor elige una opción del menú desplegable.",
                    confirmButtonText: "Entendido"
                });
                return;
            }

            if (rolSeleccionado === "comercio") {
                window.location.href = "comercios/inicioComercio.html";
            } else if (rolSeleccionado === "repartidor") {
                window.location.href = "repartidores/inicioRepartidor.html";
            } else if (rolSeleccionado === "administrador") {
                window.location.href = "administradores/inicioAdministrador.html";
            }
        });
    }
});

// Función auxiliar para redirigir si la sesión ya está activa
function redirigirAlPanel(rol) {
    if (rol === "comercio") {
        window.location.href = window.location.origin + "/sonic_delivery/comercios/RealizaP.html";
    } else if (rol === "repartidor") {
        window.location.href = window.location.origin + "/sonic_delivery/repartidores/PedidosDD.html";
    } else if (rol === "administrador") {
        window.location.href = window.location.origin + "/sonic_delivery/administradores/PanelAdmin.html";
    }
}