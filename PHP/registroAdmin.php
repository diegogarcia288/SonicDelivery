<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// PHP/registroAdmin.php
include('conexion.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cedula   = $_POST['cedula_administrador'] ?? '';
    $nombre   = $_POST['nombre_administrador'] ?? '';
    $password = $_POST['contraseña_administrador'] ?? '';
    $telefono = $_POST['telefono_administrador'] ?? '';

    $sql = "INSERT INTO administrador (cedula, nombre, contraseña, telefono) VALUES (?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("ssss", $cedula, $nombre, $password, $telefono);
        
        if ($stmt->execute()) {
            // ÉXITO: Imprimimos la alerta con SweetAlert directamente desde PHP antes de redirigir
            echo '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>';
            echo '<body style="background-color: #f8f9fa;"></body>';
            echo '<script>
                Swal.fire({
                    icon: "success",
                    title: "¡El admin fue registrado con éxito, BIENVENIDO!",
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = "../administradores/inicioAdministrador.html";
                });
            </script>';
            exit();
        } else {
            // Si ocurre un error (por ejemplo, cédula duplicada)
            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al registrar',
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