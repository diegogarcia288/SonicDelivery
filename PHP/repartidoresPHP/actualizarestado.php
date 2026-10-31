<?php
header('Content-Type: application/json');
include('../conexion.php');

$cedula = $_POST['cedula'] ?? '';
$estado = $_POST['estado'] ?? '';

if (empty($cedula) || empty($estado)) {
    echo json_encode(["exito" => false, "mensaje" => "Datos incompletos."]);
    exit;
}

// Actualizamos el estado del repartidor en la base de datos
// Nota: Tu columna en la base de datos se llama 'estado' en la tabla 'repartidor'
$sql = "UPDATE repartidor SET estado = ? WHERE CedulaR = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $estado, $cedula);

if ($stmt->execute()) {
    echo json_encode(["exito" => true, "mensaje" => "Estado actualizado con éxito."]);
} else {
    echo json_encode(["exito" => false, "mensaje" => "Error al actualizar el estado en la base de datos."]);
}

$stmt->close();
$conexion->close();
?>