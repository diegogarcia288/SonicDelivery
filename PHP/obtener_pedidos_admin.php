<?php
header('Content-Type: application/json');
include('conexion.php'); // Asegúrate de que apunta a tu archivo de conexión correcto

// Consulta adaptada a tus tablas reales: tabla 'pedidos' y tabla 'repartidor' con su columna 'CedulaR'
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