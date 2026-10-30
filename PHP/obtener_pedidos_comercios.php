<?php
header('Content-Type: application/json');
include('conexion.php'); // Asegúrate de que la ruta a tu conexión sea correcta

// Verificamos si se recibió el comercio por POST (o GET)
$comercio = isset($_POST['comercioP']) ? $_POST['comercioP'] : '';

if (empty($comercio)) {
    echo json_encode(["error" => "No se especificó el comercio"]);
    exit;
}

// Consultamos solo los pedidos que pertenecen a este comercio específico
$sql = "SELECT ID_pedido, CedulaR, comercioP, detalle, direccion, estado FROM pedidos WHERE comercioP = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $comercio);
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