<?php
// Iniciamos sesión si se requiere
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Incluimos la conexión PDO
require_once '../conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $detalle   = trim($_POST['Detalles'] ?? '');
    $direccion = trim($_POST['Direccion'] ?? '');
    $comercio  = trim($_POST['Comercio'] ?? '');
    $estado    = 'Activo'; // Estado inicial para la lista de disponibles

    // 1. Validar campos obligatorios (Dirección y Comercio)
    if (empty($direccion) || empty($comercio)) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos obligatorios',
                    text: 'La dirección y el comercio son obligatorios.'
                }).then(() => { window.history.back(); });
            });
        </script>";
        exit();
    }

    try {
        // 2. Validar estrictamente que el comercio exista en la base de datos usando PDO
        $sql_check = "SELECT UsuarioComercio FROM comercio WHERE UsuarioComercio = ?";
        $stmt_check = $pdo->prepare($sql_check);
        $stmt_check->execute([$comercio]);
        
        if ($stmt_check->rowCount() === 0) {
            // El comercio no existe en la tabla
            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        icon: 'error',
                        title: 'Comercio no encontrado',
                        text: 'El comercio ingresado no existe en el sistema.'
                    }).then(() => { window.history.back(); });
                });
            </script>";
            exit();
        }

        // 3. Si el comercio existe, procedemos a registrar el pedido de forma segura con PDO
        $sql = "INSERT INTO pedidos (comercioP, detalle, direccion, estado) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        
        if ($stmt->execute([$comercio, $detalle, $direccion, $estado])) {
            // ÉXITO: Alerta de pedido registrado con éxito y redirección
            echo '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>';
            echo '<body style="background-color: #f8f9fa;"></body>';
            echo '<script>
                Swal.fire({
                    icon: "success",
                    title: "¡Pedido registrado con éxito!",
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = window.location.origin + "/sonic_delivery/comercios/RealizaP.html";
                });
            </script>';
            exit();
        }

    } catch (PDOException $e) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar pedido',
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