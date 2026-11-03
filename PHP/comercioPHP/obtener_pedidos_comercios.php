<?php
// Desactivar la visualización de errores directos para proteger el JSON
ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json');
include('../conexion.php'); 

// Detectar variable de conexión activa ($conexion o $conn)
$db = isset($conexion) ? $conexion : (isset($conn) ? $conn : null);

if (!$db) {
    echo json_encode(["error" => "Error de conexión a la base de datos"]);
    exit;
}

$comercio = isset($_POST['comercioP']) ? trim($_POST['comercioP']) : '';

if (empty($comercio)) {
    echo json_encode(["error" => "No se especificó el comercio"]);
    exit;
}

/* 
  Consulta con LEFT JOIN usando 'CedulaR' que es el nombre exacto 
  de la llave primaria en tu tabla 'repartidor'.
*/
$sql = "SELECT p.ID_pedido, p.CedulaR, p.comercioP, p.detalle, p.direccion, p.estado, r.nombre AS nombreRepartidor 
        FROM pedidos p 
        LEFT JOIN repartidor r ON p.CedulaR = r.CedulaR 
        WHERE p.comercioP = ?";

$stmt = $db->prepare($sql);

if (!$stmt) {
    echo json_encode(["error" => "SQL Error: " . $db->error]);
    exit;
}

$stmt->bind_param("s", $comercio);
$stmt->execute();
$resultado = $stmt->get_result();

$pedidos = [];
while ($row = $resultado->fetch_assoc()) {
    if (empty($row['CedulaR'])) {
        $row['nombreRepartidor'] = 'Pendiente de tomar';
    } elseif (empty($row['nombreRepartidor'])) {
        $row['nombreRepartidor'] = 'Sin nombre';
    }
    
    $pedidos[] = $row;
}

echo json_encode($pedidos);

$stmt->close();
$db->close();
?>