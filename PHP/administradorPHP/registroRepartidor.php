<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include('../conexion.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre      = $_POST['nombre'] ?? '';
    $cedulaR     = $_POST['cedula'] ?? '';
    $password    = $_POST['contrasena'] ?? ''; 
    $telefono    = $_POST['telefono'] ?? '';
    $cedulaAdmin = $_POST['cedula_admin'] ?? '';

    // 1. Validar que ningún campo esté vacío
    if (empty($nombre) || empty($cedulaR) || empty($password) || empty($telefono) || empty($cedulaAdmin)) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Todos los campos son obligatorios, incluyendo la cédula del administrador.'
                }).then(() => { window.history.back(); });
            });
        </script>";
        exit();
    }

    // 2. Validar que el nombre no sea solo números o caracteres inválidos
    if (!preg_match('/[a-zA-ZÀ-ÿ]/', $nombre) || is_numeric($nombre)) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Nombre inválido',
                    text: 'El nombre del repartidor debe contener letras y no puede estar compuesto únicamente por números.'
                }).then(() => { window.history.back(); });
            });
        </script>";
        exit();
    }

    // 3. Verificar que el administrador exista en la base de datos
    $checkAdmin = $conexion->prepare("SELECT cedula FROM administrador WHERE cedula = ?");
    $checkAdmin->bind_param("s", $cedulaAdmin);
    $checkAdmin->execute();
    $resultadoAdmin = $checkAdmin->get_result();

    if ($resultadoAdmin->num_rows === 0) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Administrador no encontrado',
                    text: 'La cédula del administrador ingresada no está registrada en el sistema.'
                }).then(() => { window.history.back(); });
            });
        </script>";
        exit();
    }
    $checkAdmin->close();

    // 4. Verificar si la cédula del repartidor ya existe
    $checkCedula = $conexion->prepare("SELECT CedulaR FROM repartidor WHERE CedulaR = ?");
    $checkCedula->bind_param("s", $cedulaR);
    $checkCedula->execute();
    $checkCedula->store_result();

    if ($checkCedula->num_rows > 0) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'warning',
                    title: '¡Cédula ya registrada!',
                    text: 'Ya existe un repartidor registrado con la cédula " . addslashes($cedulaR) . ".',
                    confirmButtonText: 'Volver'
                }).then(() => {
                    window.history.back();
                });
            });
        </script>";
        exit();
    }
    $checkCedula->close();

    // 5. Verificar si el teléfono del repartidor ya existe
    $checkTel = $conexion->prepare("SELECT telefono FROM repartidor WHERE telefono = ?");
    $checkTel->bind_param("s", $telefono);
    $checkTel->execute();
    $checkTel->store_result();

    if ($checkTel->num_rows > 0) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'warning',
                    title: '¡Teléfono ya registrado!',
                    text: 'Ya existe un repartidor registrado con el número de teléfono " . addslashes($telefono) . ".',
                    confirmButtonText: 'Volver'
                }).then(() => {
                    window.history.back();
                });
            });
        </script>";
        exit();
    }
    $checkTel->close();

    // 6. Insertar el repartidor de forma segura
    $sql = "INSERT INTO repartidor (CedulaR, nombre, contrasena, telefono, estado, cedula_admin) VALUES (?, ?, ?, ?, 'Inactivo', ?)";
    $stmt = $conexion->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("sssss", $cedulaR, $nombre, $password, $telefono, $cedulaAdmin);
        
        if ($stmt->execute()) {
            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<body style='background-color: #f8f9fa;'></body>";
            echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        icon: 'success',
                        title: '¡El repartidor fue registrado con éxito!',
                        showConfirmButton: false,
                        timer: 2000
                    }).then(() => {
                        window.location.href = window.location.origin + '/sonic_delivery/administradores/PanelAdmin.html';
                    });
                });
            </script>";
            exit();
        } else {
            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al registrar repartidor',
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