<?php
header('Content-Type: application/json');
include('../conexion.php');

$cedula = isset($_GET['cedula']) ? $_GET['cedula'] : '';

if (empty($cedula)) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT ID_pedido, comercioP, detalle, direccion, estado 
        FROM pedidos 
        WHERE CedulaR = ? AND estado IN ('Asignado', 'Recogido')";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $cedula);
$stmt->execute();
$resultado = $stmt->get_result();

$pedidos = [];
while ($row = $resultado->fetch_assoc()) {
    $pedidos[] = $row;
}

echo json_encode($pedidos);

$stmt->close();
$conexion->close();
?>