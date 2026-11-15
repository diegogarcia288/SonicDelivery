<?php
// Iniciamos sesión si se requiere
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Incluimos la conexión PDO
require_once '../conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Aplicamos trim() para limpiar espacios accidentales al inicio o final
    $nombre      = trim($_POST['nombre'] ?? '');
    $cedulaR     = trim($_POST['cedula'] ?? '');
    $password    = trim($_POST['contrasena'] ?? ''); 
    $telefono    = trim($_POST['telefono'] ?? '');
    $cedulaAdmin = trim($_POST['cedula_admin'] ?? '');

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

    try {
        // 3. Verificar que el administrador exista en la base de datos
        $checkAdmin = $pdo->prepare("SELECT cedula FROM administrador WHERE cedula = ?");
        $checkAdmin->execute([$cedulaAdmin]);
        
        if ($checkAdmin->rowCount() === 0) {
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

        // 4. Verificar si la cédula ya existe en TODO EL SISTEMA (Repartidores o Administradores)
        $checkCedula = $pdo->prepare("
            SELECT CedulaR FROM repartidor WHERE CedulaR = ?
            UNION
            SELECT cedula FROM administrador WHERE cedula = ?
        ");
        $checkCedula->execute([$cedulaR, $cedulaR]);
        
        if ($checkCedula->rowCount() > 0) {
            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        icon: 'warning',
                        title: '¡Cédula ya registrada!',
                        text: 'El número de cédula " . addslashes($cedulaR) . " ya se encuentra registrado en el sistema (pertenece a otro usuario).',
                        confirmButtonText: 'Volver'
                    }).then(() => {
                        window.history.back();
                    });
                });
            </script>";
            exit();
        }

        // 5. Verificar si el teléfono ya existe en TODO EL SISTEMA (Repartidores o Administradores)
        $checkTel = $pdo->prepare("
            SELECT telefono FROM repartidor WHERE telefono = ?
            UNION
            SELECT telefono FROM administrador WHERE telefono = ?
        ");
        $checkTel->execute([$telefono, $telefono]);
        
        if ($checkTel->rowCount() > 0) {
            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        icon: 'warning',
                        title: '¡Teléfono ya registrado!',
                        text: 'El número de teléfono " . addslashes($telefono) . " ya se encuentra registrado en el sistema (pertenece a otro usuario).',
                        confirmButtonText: 'Volver'
                    }).then(() => {
                        window.history.back();
                    });
                });
            </script>";
            exit();
        }

        // 6. Cifrar la contraseña de manera segura
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        // 7. Insertar el repartidor de forma segura
        $sql = "INSERT INTO repartidor (CedulaR, nombre, contrasena, telefono, estado, cedula_admin) VALUES (?, ?, ?, ?, 'Inactivo', ?)";
        $stmt = $pdo->prepare($sql);
        
        if ($stmt->execute([$cedulaR, $nombre, $passwordHash, $telefono, $cedulaAdmin])) {
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
        }

    } catch (PDOException $e) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar repartidor',
                    text: 'Error en la base de datos: " . addslashes($e->getMessage()) . "',
                    confirmButtonText: 'Volver'
                }).then(() => {
                    window.history.back();
                });
            });
        </script>";
    }
}
?>