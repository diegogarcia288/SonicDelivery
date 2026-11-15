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
    echo json_encode(["exito" => false, "mensaje" => "Error de conexión a la base de datos"], JSON_UNESCAPED_UNICODE);
    exit;
}

$id_pedido         = trim($_POST['id_pedido'] ?? '');
$cedula_repartidor = trim($_POST['cedula_repartidor'] ?? '');

if (empty($id_pedido) || empty($cedula_repartidor)) {
    echo json_encode(["exito" => false, "mensaje" => "Faltan datos para asignar el pedido."], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Actualizamos el pedido de forma segura con PDO asignándole la cédula y el estado 'Asignado'
    $sql = "UPDATE pedidos SET CedulaR = ?, estado = 'Asignado' WHERE ID_pedido = ?";
    $stmt = $pdo->prepare($sql);
    
    if ($stmt->execute([$cedula_repartidor, $id_pedido])) {
        echo json_encode(["exito" => true, "mensaje" => "Pedido asignado correctamente."], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["exito" => false, "mensaje" => "Error al actualizar la base de datos."], JSON_UNESCAPED_UNICODE);
    }

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error SQL: " . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>