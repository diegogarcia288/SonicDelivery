<?php
// Desactivamos la visualización de errores en pantalla para que no ensucien el JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

// Ajusta la ruta de inclusión de la conexión según tu estructura real (ej. '../../PHP/conexion.php' o '../conexion.php')
include('../conexion.php'); 

$cedula = $_GET['cedula'] ?? '';

if (empty($cedula)) {
    echo json_encode([]);
    exit();
}

$sql = "SELECT * FROM pedidos WHERE CedulaR = ? AND estado = 'Asignado'";
$stmt = $conexion->prepare($sql);

if ($stmt) {
    $stmt->bind_param("s", $cedula);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $pedidos = [];
    while ($row = $resultado->fetch_assoc()) {
        $pedidos[] = $row;
    }

    $stmt->close();
    echo json_encode($pedidos);
} else {
    echo json_encode(["error" => "Error en la consulta"]);
}

$conexion->close();
?>