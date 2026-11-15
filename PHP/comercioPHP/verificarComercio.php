<?php
// Iniciamos sesión para proteger el acceso al panel del comercio
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Conexión PDO (asegúrate de que esté dos niveles arriba si estás en comercioPHP, o ajusta a '../conexion.php' si está un nivel arriba)
require_once '../conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Capturamos usando los name exactos del HTML: 'UsuarioComercio' y 'contrasena'
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

    try {
        // Consulta SQL usando PDO y consultas preparadas
        $sql = "SELECT * FROM comercio WHERE UsuarioComercio = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$usuario]);
        $comercio = $stmt->fetch();

        // Si se encuentra el registro del comercio
        if ($comercio) {
            $stored_hash = $comercio['contraseña'];

            // Verificar contraseña (compatible con hashes seguros o texto plano temporal)
            if (password_verify($password, $stored_hash) || $password === $stored_hash) {
                
                // Creamos las variables de sesión de PHP
                $_SESSION['usuario_comercio'] = $usuario;

                echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
                echo "<script>
                    document.addEventListener('DOMContentLoaded', function() {
                        localStorage.setItem('rolSonic', 'comercio');
                        localStorage.setItem('usuarioComercio', '" . addslashes($usuario) . "');

                        Swal.fire({
                            icon: 'success',
                            title: '¡Bienvenido, Comercio!',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            window.location.href = window.location.origin + '/sonic_delivery/comercios/RealizaP.html';
                        });
                    });
                </script>";
                exit();
            }
        }

        // Si falla la autenticación (usuario no existe o contraseña incorrecta)
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