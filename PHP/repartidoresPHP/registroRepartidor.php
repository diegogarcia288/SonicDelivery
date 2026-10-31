<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include('conexion.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cedula   = $_POST['cedula_administrador'] ?? '';
    $nombre   = $_POST['nombre_administrador'] ?? '';
    $password = $_POST['contraseña_administrador'] ?? '';
    $telefono = $_POST['telefono_administrador'] ?? '';

    // 1. Validar que los campos no estén vacíos
    if (empty($cedula) || empty($nombre) || empty($password) || empty($telefono)) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos vacíos',
                    text: 'Por favor completa todos los campos del formulario.'
                }).then(() => { window.history.back(); });
            });
        </script>";
        exit();
    }

    // 2. Validar que la cédula y el teléfono sean solo números
    if (!ctype_digit($cedula) || !ctype_digit($telefono)) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Formato inválido',
                    text: 'La cédula y el teléfono deben contener únicamente números.'
                }).then(() => { window.history.back(); });
            });
        </script>";
        exit();
    }

    // 3. Insertar el administrador de forma segura
    $sql = "INSERT INTO administrador (cedula, nombre, contraseña, telefono) VALUES (?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("ssss", $cedula, $nombre, $password, $telefono);
        
        if ($stmt->execute()) {
            echo '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>';
            echo '<body style="background-color: #f8f9fa;"></body>';
            echo '<script>
                Swal.fire({
                    icon: "success",
                    title: "¡El admin fue registrado con éxito, BIENVENIDO!",
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = window.location.origin + "/sonic_delivery/administradores/PanelAdmin.html";
                });
            </script>';
            exit();
        } else {
            // Error en base de datos (por ejemplo, si la cédula ya está registrada)
            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al registrar',
                        text: '" . addslashes($stmt->error) . "',
                        confirmButtonText: 'Volver'
                    }).then(() => {
                        window.history.back();
                    });
                });
            </script>";
        }
        
        $stmt->close();
    } else {
        echo "Error en la preparación de la consulta: " . $conexion->error;
    }

    $conexion->close();
}
?>