<?php
// Ocultar errores en producción para que no rompan la estructura JSON
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json; charset=utf-8');

// Subimos un nivel desde administradorPHP para encontrar conexion.php
if (file_exists('../conexion.php')) {
    include('../conexion.php');
} elseif (file_exists('conexion.php')) {
    include('conexion.php');
}

// Validar que la conexión PDO ($pdo) exista
if (!isset($pdo)) {
    echo json_encode([]);
    exit;
}

try {
    // Consulta utilizando PDO (compatible con tu estructura de tablas)
    $sql = "SELECT p.*, r.nombre AS nombreRepartidor 
            FROM pedidos p 
            LEFT JOIN repartidor r ON p.CedulaR = r.CedulaR 
            ORDER BY p.ID_pedido DESC";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $pedidos = $stmt->fetchAll();

    // Opcional: Asegurar que los textos viajen limpios de caracteres extraños
    // PDO ya maneja los arreglos de forma segura al hacer json_encode
    echo json_encode($pedidos, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    // Si ocurre un error en la consulta, devolvemos un arreglo vacío en formato JSON
    echo json_encode([]);
}
?>