<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');

// Incluir la conexión subiendo un nivel desde repartidoresPHP hacia PHP/
if (file_exists('../conexion.php')) {
    include('../conexion.php');
} elseif (file_exists('conexion.php')) {
    include('conexion.php');
}

if (!isset($conexion) || $conexion->connect_error) {
    echo json_encode([]);
    exit;
}

// Consultar los pedidos que estén activos (disponibles para tomar)
$query = "SELECT * FROM pedidos WHERE estado = 'Activo' ORDER BY ID_pedido ASC";
$resultado = mysqli_query($conexion, $query);

$pedidos = [];

if ($resultado) {
    while ($row = mysqli_fetch_assoc($resultado)) {
        $pedidos[] = $row;
    }
}

echo json_encode($pedidos);

if (isset($conexion)) {
    $conexion->close();
}
?>