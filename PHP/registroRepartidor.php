<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include('conexion.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cedula       = $_POST['cedula_repartidor'] ?? '';
    $nombre       = $_POST['nombre_repartidor'] ?? '';
    $password     = $_POST['contrasena_repartidor'] ?? '';
    $telefono     = $_POST['telefono_repartidor'] ?? '';
    $cedula_admin = $_POST['cedula_admin'] ?? '';

    // 1. Validar que los campos no estén vacíos
    if (empty($cedula) || empty($nombre) || empty($password) || empty($telefono) || empty($cedula_admin)) {
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

    // 2. Verificar primero si la cédula del administrador existe en la base de datos
    $sql_check = "SELECT * FROM administrador WHERE cedula = ?";
    $stmt_check = $conexion->prepare($sql_check);
    $stmt_check->bind_param("s", $cedula_admin);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows === 0) {
        // La cédula del administrador NO existe -> Mostramos la alerta de SweetAlert
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Administrador no encontrado',
                    text: 'Esa cédula no está asociada a un administrador.'
                }).then(() => { window.history.back(); });
            });
        </script>";
        $stmt_check->close();
        $conexion->close();
        exit();
    }
    $stmt_check->close();

    // 3. Si el administrador sí existe, procedemos a registrar al repartidor
    $sql = "INSERT INTO repartidor (CedulaR, nombre, contrasena, telefono, cedula_admin) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("sssss", $cedula, $nombre, $password, $telefono, $cedula_admin);
        
        if ($stmt->execute()) {
            echo '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>';
            echo '<body style="background-color: #f8f9fa;"></body>';
            echo '<script>
                Swal.fire({
                    icon: "success",
                    title: "¡El repartidor fue registrado con éxito, BIENVENIDO!",
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = "../repartidores/inicioRepartidor.html";
                });
            </script>';
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