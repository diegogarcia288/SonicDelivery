<?php
// Salimos un nivel para encontrar la conexión global
include('../conexion.php');

header('Content-Type: application/json');

$id_pedido = $_POST['id_pedido'] ?? '';
$cedula_repartidor = $_POST['cedula_repartidor'] ?? '';

if (empty($id_pedido) || empty($cedula_repartidor)) {
    echo json_encode(["exito" => false, "mensaje" => "Faltan datos para asignar el pedido."]);
    exit;
}

// Actualizamos el pedido asignándole la cédula del repartidor y cambiando el estado a 'Asignado'
$sql = "UPDATE pedidos SET CedulaR = '$cedula_repartidor', estado = 'Asignado' WHERE ID_pedido = '$id_pedido'";
$resultado = mysqli_query($conexion, $sql);

if ($resultado) {
    echo json_encode(["exito" => true, "mensaje" => "Pedido asignado correctamente."]);
} else {
    echo json_encode(["exito" => false, "mensaje" => "Error al actualizar la base de datos."]);
}

$conexion->close();
exit;
?>