<?php
// Iniciamos sesión para poder acceder a los datos actuales y destruirlos
session_start();

// 1. Vaciamos el arreglo global de sesión
$_SESSION = array();

// 2. Destruimos la cookie de sesión del navegador si está habilitada
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 3. Destruimos la sesión en el servidor por completo
session_destroy();

// 4. Redirigimos al usuario al login o a la página principal de Sonic Delivery
header("Location: ../index.html"); // Ajusta la ruta relativa según el lugar donde guardes este archivo
exit();
?>