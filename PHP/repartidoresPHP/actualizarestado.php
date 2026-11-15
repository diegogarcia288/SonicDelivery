<?php
// Desactivar la visualización de errores directos para proteger el JSON
ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json; charset=utf-8');

// Incluir la conexión PDO
if (file_exists('../conexion.php')) {
    include('../conexion.php');
} elseif (file_exists('conexion.php')) {
    include('conexion.php');
}

// Validar que la conexión PDO ($pdo) exista
if (!isset($pdo)) {
    echo json_encode(["exito" => false, "mensaje" => "Error de conexión a la base de datos"]);
    exit;
}

$cedula = trim($_POST['cedula'] ?? '');
$estado = trim($_POST['estado'] ?? '');

if (empty($cedula) || empty($estado)) {
    echo json_encode(["exito" => false, "mensaje" => "Datos incompletos."]);
    exit;
}

try {
    // Actualizamos el estado del repartidor usando consultas preparadas con PDO
    $sql = "UPDATE repartidor SET estado = ? WHERE CedulaR = ?";
    $stmt = $pdo->prepare($sql);
    
    if ($stmt->execute([$estado, $cedula])) {
        echo json_encode(["exito" => true, "mensaje" => "Estado actualizado con éxito."], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["exito" => false, "mensaje" => "Error al actualizar el estado en la base de datos."], JSON_UNESCAPED_UNICODE);
    }

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error en la base de datos: " . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>