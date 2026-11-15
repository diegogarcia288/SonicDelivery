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

$cedula = isset($_GET['cedula']) ? trim($_GET['cedula']) : '';

if (empty($cedula)) {
    echo json_encode([], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Consultar los pedidos tomados por el repartidor usando PDO y consultas preparadas
    $sql = "SELECT ID_pedido, comercioP, detalle, direccion, estado 
            FROM pedidos 
            WHERE CedulaR = ? AND estado IN ('Asignado', 'Recogido')";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$cedula]);
    
    // Obtener todos los registros en un arreglo asociativo
    $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devolver el JSON limpio con soporte Unicode
    echo json_encode($pedidos, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    // Si hay error en la base de datos, devolver un arreglo vacío
    echo json_encode([], JSON_UNESCAPED_UNICODE);
}
?>