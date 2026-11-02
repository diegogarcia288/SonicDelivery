<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include('../conexion.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $detalle = $_POST['Detalles'] ?? '';
    $direccion = $_POST['Direccion'] ?? '';
    $comercio = $_POST['Comercio'] ?? '';
    $estado = 'Activo'; // Estado inicial para la lista de disponibles

    // 1. Validar campos obligatorios (Dirección y Comercio)
    if (empty($direccion) || empty($comercio)) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos obligatorios',
                    text: 'La dirección y el comercio son obligatorios.'
                }).then(() => { window.history.back(); });
            });
        </script>";
        exit();
    }

    // 2. Validar estrictamente que el comercio exista en la base de datos (UsuarioComercio es PK)
    $sql_check = "SELECT * FROM comercio WHERE UsuarioComercio = ?";
    $stmt_check = $conexion->prepare($sql_check);
    $stmt_check->bind_param("s", $comercio);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows === 0) {
        // El comercio no existe en la tabla
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Comercio no encontrado',
                    text: 'El comercio ingresado no existe en el sistema.'
                }).then(() => { window.history.back(); });
            });
        </script>";
        $stmt_check->close();
        $conexion->close();
        exit();
    }
    $stmt_check->close();

    // 3. Si el comercio existe, procedemos a registrar el pedido
    $sql = "INSERT INTO pedidos (comercioP, detalle, direccion, estado) VALUES (?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("ssss", $comercio, $detalle, $direccion, $estado);

        if ($stmt->execute()) {
            // ÉXITO: Alerta de pedido registrado con éxito y redirección
            echo '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>';
            echo '<body style="background-color: #f8f9fa;"></body>';
            echo '<script>
                Swal.fire({
                    icon: "success",
                    title: "¡Pedido registrado con éxito!",
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = window.location.origin + "/sonic_delivery/comercios/RealizaP.html";
                });
            </script>';
            exit();
        } else {
            echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
            echo "<script>
                document.addEventListener(\"DOMContentLoaded\", function() {
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