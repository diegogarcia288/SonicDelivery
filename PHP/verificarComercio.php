<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include('conexion.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Capturamos exactamente el 'UsuarioComercio' y la 'contraseña' enviados desde el formulario
    $usuario = $_POST['UsuarioComercio'] ?? '';
    $password = $_POST['contrasena'] ?? '';

    // Validar que no estén vacíos
    if (empty($usuario) || empty($password)) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos vacíos',
                    text: 'Por favor ingresa el usuario y la contraseña.'
                }).then(() => { window.history.back(); });
            });
        </script>";
        exit();
    }

    // Consulta SQL usando las columnas exactas de tu tabla en XAMPP
    $sql = "SELECT * FROM comercio WHERE UsuarioComercio = ? AND contraseña = ?";
    $stmt = $conexion->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("ss", $usuario, $password);
        $stmt->execute();
        $resultado = $stmt->get_result();

        // Si se encuentra el registro exacto
        if ($resultado->num_rows === 1) {
            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Bienvenido, Comercio!',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = '../comercios/RealizaP.html'; // <-- Cambia aquí la ruta según necesites
                    });
                });
            </script>";
        } else {
            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        icon: 'error',
                        title: 'Datos incorrectos',
                        text: 'El usuario o la contraseña no coinciden.'
                    }).then(() => { window.history.back(); });
                });
            </script>";
        }

        $stmt->close();
    } else {
        echo "Error en la consulta: " . $conexion->error;
    }

    $conexion->close();
}
?>