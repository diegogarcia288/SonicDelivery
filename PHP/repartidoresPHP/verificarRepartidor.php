<?php
// Iniciamos sesión para proteger el acceso
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Conexión PDO
require_once '../conexion.php';

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

    try {
        // Consulta SQL usando PDO y consultas preparadas con la columna exacta 'CedulaR'
        $sql = "SELECT * FROM repartidor WHERE CedulaR = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$cedula]);
        $repartidor = $stmt->fetch();

        // Si se encuentra el registro del repartidor
        if ($repartidor) {
            $stored_hash = $repartidor['contrasena']; // Columna de contraseña en tu BD
            $nombreRepartidor = $repartidor['nombre']; // Columna del nombre en tu BD

            // Verificar contraseña (compatible con hashes seguros o texto plano temporal)
            if (password_verify($password, $stored_hash) || $password === $stored_hash) {
                
                // Creamos las variables de sesión de PHP
                $_SESSION['repartidor_cedula'] = $cedula;
                $_SESSION['repartidor_nombre'] = $nombreRepartidor;

                echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
                echo "<script>
                    document.addEventListener('DOMContentLoaded', function() {
                        // --- GUARDAR LA SESIÓN EN EL NAVEGADOR ---
                        localStorage.setItem('rolSonic', 'Repartidor');
                        localStorage.setItem('cedulaRepartidor', '" . $cedula . "');
                        localStorage.setItem('nombreRepartidor', '" . addslashes($nombreRepartidor) . "');

                        Swal.fire({
                            icon: 'success',
                            title: '¡Bienvenido, Repartidor!',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            window.location.href = '../../repartidores/PedidosDD.html'; 
                        });
                    });
                </script>";
                exit();
            }
        }

        // Si falla la autenticación
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