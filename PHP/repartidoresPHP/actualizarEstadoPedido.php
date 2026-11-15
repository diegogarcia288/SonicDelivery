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
    echo json_encode(['exito' => false, 'mensaje' => 'Error de conexión a la base de datos'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_pedido         = isset($_POST['id_pedido']) ? intval($_POST['id_pedido']) : 0;
    $nuevo_estado      = isset($_POST['nuevo_estado']) ? trim($_POST['nuevo_estado']) : '';
    $cedula_repartidor = isset($_POST['cedula_repartidor']) ? trim($_POST['cedula_repartidor']) : '';

    // Estados permitidos según tu lógica de negocio
    $estadosPermitidos = ['Recogido', 'Entregado'];
    
    if ($id_pedido <= 0 || !in_array($nuevo_estado, $estadosPermitidos) || empty($cedula_repartidor)) {
        echo json_encode(['exito' => false, 'mensaje' => 'Datos incompletos o estado no válido.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    try {
        // Actualizamos el estado del pedido de forma segura con PDO
        $sql = "UPDATE pedidos SET estado = ? WHERE ID_pedido = ?";
        $stmt = $pdo->prepare($sql);

        if ($stmt->execute([$nuevo_estado, $id_pedido])) {
            echo json_encode(['exito' => true, 'mensaje' => 'Estado actualizado correctamente.'], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(['exito' => false, 'mensaje' => 'Error en la base de datos al actualizar.'], JSON_UNESCAPED_UNICODE);
        }

    } catch (PDOException $e) {
        echo json_encode(['exito' => false, 'mensaje' => 'Error SQL: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }

} else {
    echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido.'], JSON_UNESCAPED_UNICODE);
}
?>