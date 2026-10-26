<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// PHP/registroComercio.php
include('conexion.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Capturamos los datos alineados con los 'name' de tu formulario HTML
    $usuarioComercio = $_POST['Detalles'] ?? '';     // Viene del input 'nombre' (Usuario Comercio)
    $direccionC      = $_POST['Direccion'] ?? '';  // Viene del input 'direccion'



    // Consulta SQL adaptada exactamente a los nombres de la estructura de tu tabla 'comercio'
    $sql = "INSERT INTO pedido (UsuarioComercio, direccionC) VALUES (?, ?)";
    $stmt = $conexion->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("ss", $usuarioComercio, $direccionC);
        
        if ($stmt->execute()) {                                                        
            // ÉXITO: Alerta con SweetAlert y redirección
            echo '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>';
            echo '<body style="background-color: #f8f9fa;"></body>';
            echo '<script>
                Swal.fire({
                    icon: "success",
                    title: "¡El pedido fue registrado con éxito, BIENVENIDO!",
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = "../comercios/RealizaP.html";
                });
            </script>';
            exit();
        } else {
            // Si ocurre un error (por ejemplo, si el UsuarioComercio ya existe)
            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al registrar pedido',
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