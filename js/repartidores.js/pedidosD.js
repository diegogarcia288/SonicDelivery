// pedidosD.js - Únicamente validación de seguridad para el rol de repartidor
document.addEventListener("DOMContentLoaded", function() {
    let rolActivo = localStorage.getItem("rolSonic");
    
    if (!rolActivo || rolActivo.toLowerCase() !== "repartidor") {
        Swal.fire({
            icon: "error",
            title: "Acceso denegado",
            text: "Debes iniciar sesión como repartidor para ver esta sección."
        }).then(() => {
            window.location.href = window.location.origin + "/sonic_delivery/iniciosesion.html";
        });
    }
});