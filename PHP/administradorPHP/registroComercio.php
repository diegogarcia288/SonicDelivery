<?php
// Iniciamos sesión si se requiere
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Incluimos la conexión PDO
require_once '../conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Capturamos los datos alineados con los 'name' del formulario HTML
    $usuarioComercio = $_POST['nombre'] ?? '';     // Viene del input 'nombre'
    $direccionC      = $_POST['direccion'] ?? '';  // Viene del input 'direccion'
    $emailC          = $_POST['correo'] ?? '';     // Viene del input 'correo'
    $password        = $_POST['contraseña'] ?? ''; // Viene del input 'contraseña'

    // 1. Validar campos vacíos
    if (empty($usuarioComercio) || empty($direccionC) || empty($emailC) || empty($password)) {
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

    // 2. Validar formato de correo electrónico válido
    if (!filter_var($emailC, FILTER_VALIDATE_EMAIL)) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Correo inválido',
                    text: 'Por favor ingresa una dirección de correo electrónico válida.'
                }).then(() => { window.history.back(); });
            });
        </script>";
        exit();
    }

    try {
        // 3. Cifrar la contraseña de manera segura
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        // 4. Consulta SQL segura para insertar el comercio utilizando PDO
        $sql = "INSERT INTO comercio (UsuarioComercio, direccionC, emailC, contraseña) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        
        if ($stmt->execute([$usuarioComercio, $direccionC, $emailC, $passwordHash])) {
            // ÉXITO: Alerta con SweetAlert y redirección
            echo '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>';
            echo '<body style="background-color: #f8f9fa;"></body>';
            echo '<script>
                Swal.fire({
                    icon: "success",
                    title: "¡El comercio fue registrado con éxito, BIENVENIDO!",
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = window.location.origin + "/sonic_delivery/administradores/PanelAdmin.html";
                });
            </script>';
            exit();
        }

    } catch (PDOException $e) {
        // Capturamos el error de duplicidad (código 23000 en PDO para índices únicos)
        $mensajeError = ($e->getCode() == 23000) 
            ? "Ya existe un comercio registrado con el usuario '" . addslashes($usuarioComercio) . "' o correo duplicado." 
            : "Error en la base de datos: " . $e->getMessage();

        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'warning',
                    title: '¡No se pudo registrar!',
                    text: '" . addslashes($mensajeError) . "',
                    confirmButtonText: 'Volver'
                }).then(() => {
                    window.history.back();
                });
            });
        </script>";
    }
}
?>