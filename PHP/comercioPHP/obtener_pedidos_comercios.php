<?php
// Desactivar la visualización de errores directos para proteger el JSON
ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json; charset=utf-8');

// Incluir la conexión PDO
if (file_exists('../conexion.php')) {
    include('../conexion.php');
} elseif (file_exists('conexion.php')) {
    include('conexion.php');
}

// Validar que la conexión PDO ($pdo) exista
if (!isset($pdo)) {
    echo json_encode(["error" => "Error de conexión a la base de datos"]);
    exit;
}

$comercio = isset($_POST['comercioP']) ? trim($_POST['comercioP']) : '';

if (empty($comercio)) {
    echo json_encode(["error" => "No se especificó el comercio"]);
    exit;
}

try {
    /* 
      Consulta con LEFT JOIN usando PDO y 'CedulaR' como llave para traer 
      la información de los pedidos y el repartidor asignado.
    */
    $sql = "SELECT p.ID_pedido, p.CedulaR, p.comercioP, p.detalle, p.direccion, p.estado, r.nombre AS nombreRepartidor 
            FROM pedidos p 
            LEFT JOIN repartidor r ON p.CedulaR = r.CedulaR 
            WHERE p.comercioP = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$comercio]);
    $pedidosOriginales = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $pedidos = [];
    foreach ($pedidosOriginales as $row) {
        if (empty($row['CedulaR'])) {
            $row['nombreRepartidor'] = 'Pendiente de tomar';
        } elseif (empty($row['nombreRepartidor'])) {
            $row['nombreRepartidor'] = 'Sin nombre';
        }
        
        $pedidos[] = $row;
    }

    // Devolver el JSON con codificación limpia
    echo json_encode($pedidos, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode(["error" => "SQL Error: " . $e->getMessage()]);
}
?>