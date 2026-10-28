<?php
include('conexion.php');

// Consultar los pedidos que estén activos (disponibles para tomar)
$query = "SELECT * FROM pedidos WHERE estado = 'Activo' ORDER BY ID_pedido DESC";
$resultado = mysqli_query($conexion, $query);

$pedidos = [];

if ($resultado) {
    while ($row = mysqli_fetch_assoc($resultado)) {
        $pedidos[] = $row;
    }
}

// Retornar los datos en formato JSON
header('Content-Type: application/json');
echo json_encode($pedidos);
?>