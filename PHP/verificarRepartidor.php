<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include('conexion.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Capturamos usando exactamente los 'name' del formulario HTML
    $cedula = $_POST['cedula_repartidor'] ?? '';
    $password = $_POST['contrasena_repartidor'] ?? '';

    // Validar que no estén vacíos
    if (empty($cedula) || empty($password)) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos vacíos',
                    text: 'Por favor ingresa la cédula y la contraseña.'
                }).then(() => { window.history.back(); });
            });
        </script>";
        exit();
    }

    // Consulta SQL usando las columnas reales de la tabla 'repartidor'
    $sql = "SELECT * FROM repartidor WHERE CedulaR = ? AND contrasena = ?";
    $stmt = $conexion->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("ss", $cedula, $password);
        $stmt->execute();
        $resultado = $stmt->get_result();

        // Si se encuentra el registro exacto
        if ($resultado->num_rows === 1) {
            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Bienvenido, Repartidor!',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = '../repartidores/PedidosDD.html'; // Cambia esta ruta si tu panel está en otra carpeta
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
                        text: 'La cédula o la contraseña no coinciden.'
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