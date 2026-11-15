<?php
// Iniciamos sesión para proteger el acceso al panel
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Subimos un nivel desde administradorPHP para encontrar conexion.php
require_once '../conexion.php';

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

    try {
        // 3. Consultar en la base de datos usando PDO y consultas preparadas
        $sql = "SELECT * FROM administrador WHERE cedula = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$cedula]);
        $admin = $stmt->fetch();

        // Si se encuentra el administrador
        if ($admin) {
            $stored_hash = $admin['contraseña'];
            $nombreAdmin = $admin['nombre'];

            // 4. Verificar contraseña (compatible con hashes seguros o texto plano temporal)
            if (password_verify($password, $stored_hash) || $password === $stored_hash) {
                
                // Creamos las variables de sesión de PHP
                $_SESSION['admin_cedula'] = $cedula;
                $_SESSION['admin_nombre'] = $nombreAdmin;

                // Éxito: Guardamos en localStorage, mostramos alerta y redirigimos
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
                exit();
            }
        }

        // Si falla la autenticación (cédula no existe o contraseña incorrecta)
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

    } catch (Exception $e) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de sistema',
                    text: 'Ocurrió un error al procesar la solicitud.'
                }).then(() => { window.history.back(); });
            });
        </script>";
    }
}
?>