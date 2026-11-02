<?php
header('Content-Type: application/json');
include('../conexion.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_pedido = isset($_POST['id_pedido']) ? intval($_POST['id_pedido']) : 0;
    $nuevo_estado = isset($_POST['nuevo_estado']) ? trim($_POST['nuevo_estado']) : '';
    $cedula_repartidor = isset($_POST['cedula_repartidor']) ? trim($_POST['cedula_repartidor']) : '';

    $estadosPermitidos = ['Recogido', 'Entregado'];
    if ($id_pedido <= 0 || !in_array($nuevo_estado, $estadosPermitidos) || empty($cedula_repartidor)) {
        echo json_encode(['exito' => false, 'mensaje' => 'Datos incompletos o estado no válido.']);
        exit;
    }

    $sql = "UPDATE pedidos SET estado = ? WHERE ID_pedido = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("si", $nuevo_estado, $id_pedido);

    if ($stmt->execute()) {
        echo json_encode(['exito' => true, 'mensaje' => 'Estado actualizado correctamente.']);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error en la base de datos al actualizar.']);
    }

    $stmt->close();
    $conexion->close();
} else {
    echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido.']);
}
?>