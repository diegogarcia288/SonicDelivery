<?php
// Desactivar la visualización de errores directos para proteger el JSON
ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json; charset=utf-8');

// Incluir la conexión PDO (subiendo un nivel si es necesario)
if (file_exists('../conexion.php')) {
    include('../conexion.php');
} elseif (file_exists('conexion.php')) {
    include('conexion.php');
}

// Validar que la conexión PDO ($pdo) exista
if (!isset($pdo)) {
    echo json_encode([], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Consultar los pedidos que estén activos (disponibles para tomar) usando PDO
    $query = "SELECT * FROM pedidos WHERE estado = 'Activo' ORDER BY ID_pedido ASC";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    // Obtener todos los registros como un arreglo asociativo limpio
    $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devolver el JSON con soporte completo para tildes y caracteres especiales
    echo json_encode($pedidos, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    // Si ocurre un error en la BD, devolvemos un arreglo vacío para no romper el frontend
    echo json_encode([], JSON_UNESCAPED_UNICODE);
}
?>