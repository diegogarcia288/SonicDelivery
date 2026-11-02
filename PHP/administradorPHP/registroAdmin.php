<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// PHP/registroAdmin.php
include('../conexion.php');

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

    // 3. Verificar si la cédula ya existe
    $sql_cedula = "SELECT cedula FROM administrador WHERE cedula = ?";
    $stmt_c = $conexion->prepare($sql_cedula);
    $stmt_c->bind_param("s", $cedula);
    $stmt_c->execute();
    $stmt_c->store_result();

    if ($stmt_c->num_rows > 0) {
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
    $stmt_c->close();

    // 4. Verificar si el teléfono ya existe
    $sql_tel = "SELECT telefono FROM administrador WHERE telefono = ?";
    $stmt_t = $conexion->prepare($sql_tel);
    $stmt_t->bind_param("s", $telefono);
    $stmt_t->execute();
    $stmt_t->store_result();

    if ($stmt_t->num_rows > 0) {
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
    $stmt_t->close();

    // 5. Insertar el registro protegido con try-catch
    $sql = "INSERT INTO administrador (cedula, nombre, contraseña, telefono) VALUES (?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("ssss", $cedula, $nombre, $password, $telefono);
        
        try {
            if ($stmt->execute()) {
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
        } catch (mysqli_sql_exception $e) {
            $mensajeError = ($e->getCode() === 1062) 
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
        
        $stmt->close();
    } else {
        echo "Error en la preparación de la consulta: " . $conexion->error;
    }

    $conexion->close();
}
?>