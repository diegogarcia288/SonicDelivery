<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');

// Subimos un nivel desde administradorPHP para encontrar conexion.php
if (file_exists('../conexion.php')) {
    include('../conexion.php');
} elseif (file_exists('conexion.php')) {
    include('conexion.php');
}

if (!isset($conexion) || $conexion->connect_error) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT p.*, r.nombre AS nombreRepartidor 
        FROM pedidos p 
        LEFT JOIN repartidor r ON p.CedulaR = r.CedulaR 
        ORDER BY p.ID_pedido DESC";

$resultado = $conexion->query($sql);

$pedidos = [];
if ($resultado && $resultado->num_rows > 0) {
    while($row = $resultado->fetch_assoc()) {
        $pedidos[] = $row;
    }
}

echo json_encode($pedidos);
$conexion->close();
?>