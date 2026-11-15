<?php
// Iniciamos sesión si se requiere
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// PHP/registroAdmin.php - Incluimos la conexión PDO
require_once '../conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cedula   = $_POST['cedula_administrador'] ?? '';
    $nombre   = $_POST['nombre_administrador'] ?? '';
    $password = $_POST['contraseña_administrador'] ?? '';
    $telefono = $_POST['telefono_administrador'] ?? '';

    // 1. Validar que ningún campo esté vacío
    if (empty($cedula) || empty($nombre) || empty($password) || empty($telefono)) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Por favor completa todos los campos del formulario.'
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
                    text: 'El nombre del administrador debe contener letras y no puede estar compuesto únicamente por números.'
                }).then(() => { window.history.back(); });
            });
        </script>";
        exit();
    }

    try {
        // 3. Verificar si la cédula ya existe usando PDO
        $sql_cedula = "SELECT cedula FROM administrador WHERE cedula = ?";
        $stmt_c = $pdo->prepare($sql_cedula);
        $stmt_c->execute([$cedula]);
        
        if ($stmt_c->rowCount() > 0) {
            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        icon: 'warning',
                        title: '¡Cédula ya registrada!',
                        text: 'Ya existe un administrador registrado con la cédula " . addslashes($cedula) . ".',
                        confirmButtonText: 'Volver'
                    }).then(() => {
                        window.history.back();
                    });
                });
            </script>";
            exit();
        }

        // 4. Verificar si el teléfono ya existe usando PDO
        $sql_tel = "SELECT telefono FROM administrador WHERE telefono = ?";
        $stmt_t = $pdo->prepare($sql_tel);
        $stmt_t->execute([$telefono]);
        
        if ($stmt_t->rowCount() > 0) {
            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        icon: 'warning',
                        title: '¡Teléfono ya registrado!',
                        text: 'Ya existe un administrador registrado con el número de teléfono " . addslashes($telefono) . ".',
                        confirmButtonText: 'Volver'
                    }).then(() => {
                        window.history.back();
                    });
                });
            </script>";
            exit();
        }

        // 5. Cifrar la contraseña de manera segura antes de guardarla
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        // 6. Insertar el registro protegido con PDO
        $sql = "INSERT INTO administrador (cedula, nombre, contraseña, telefono) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        
        if ($stmt->execute([$cedula, $nombre, $passwordHash, $telefono])) {
            // ÉXITO
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
        }

    } catch (PDOException $e) {
        // Código 23000 o duplicidad en MySQL
        $mensajeError = ($e->getCode() == 23000) 
            ? "La cédula o el teléfono ya se encuentran registrados en el sistema." 
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