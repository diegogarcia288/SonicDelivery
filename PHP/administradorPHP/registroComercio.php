<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include('../conexion.php');

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

    // 3. Consulta SQL segura para insertar el comercio protegida con try-catch
    $sql = "INSERT INTO comercio (UsuarioComercio, direccionC, emailC, contraseña) VALUES (?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("ssss", $usuarioComercio, $direccionC, $emailC, $password);
        
        try {
            if ($stmt->execute()) {
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
        } catch (mysqli_sql_exception $e) {
            // Capturamos el error de duplicidad (1062) para mostrar la alerta personalizada
            $mensajeError = ($e->getCode() === 1062) 
                ? "Ya existe un comercio registrado con el usuario '" . addslashes($usuarioComercio) . "'." 
                : "Error en la base de datos: " . $e->getMessage();

            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        icon: 'warning',
                        title: '¡Comercio ya registrado!',
                        text: '" . addslashes($mensajeError) . "',
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