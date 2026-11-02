<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Subimos un nivel desde administradorPHP para encontrar conexion.php
include('../conexion.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cedula = $_POST['cedula_administrador'] ?? '';
    $password = $_POST['contraseña_administrador'] ?? '';

    // 1. Validar que no estén vacíos
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

    // 2. Validar que la cédula contenga solo números
    if (!ctype_digit($cedula)) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Formato inválido',
                    text: 'La cédula debe contener solo números.'
                }).then(() => { window.history.back(); });
            });
        </script>";
        exit();
    }

    // 3. Consultar en la base de datos usando consultas preparadas
    $sql = "SELECT * FROM administrador WHERE cedula = ? AND contraseña = ?";
    $stmt = $conexion->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("ss", $cedula, $password);
        $stmt->execute();
        $resultado = $stmt->get_result();

        // Si se encuentra un registro que coincide
        if ($resultado->num_rows === 1) {
            $row = $resultado->fetch_assoc();
            $nombreAdmin = $row['nombre'];

            // Éxito: Guardamos en localStorage, mostramos alerta y redirigimos (con comillas corregidas)
            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    localStorage.setItem('rolSonic', 'Administrador');
                    localStorage.setItem('nombreUsuario', '" . addslashes($nombreAdmin) . "');

                    Swal.fire({
                        icon: 'success',
                        title: '¡Bienvenido al sistema, Administrador!',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = window.location.origin + '/sonic_delivery/administradores/PanelAdmin.html';
                    });
                });
            </script>";
        } else {
            // Error: Cédula o contraseña incorrectas
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