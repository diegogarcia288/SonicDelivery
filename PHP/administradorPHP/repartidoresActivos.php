<?php
// Ocultar cualquier error en pantalla para proteger la salida JSON
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');

// Incluir la conexión subiendo un nivel desde administradorPHP hacia PHP/
if (file_exists('../conexion.php')) {
    include('../conexion.php');
} elseif (file_exists('conexion.php')) {
    include('conexion.php');
}

// Validar que la conexión PDO ($pdo) exista
if (!isset($pdo)) {
    echo json_encode([]);
    exit;
}

$repartidores = [];

try {
    // 1. Consultar únicamente los repartidores activos usando PDO
    $sql = "SELECT CedulaR AS id, nombre, estado FROM repartidor WHERE estado = 'Activo'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $listaRepartidores = $stmt->fetchAll();

    foreach ($listaRepartidores as $row) {
        $cedula = $row['id'];
        $total_pedidos = 0;

        // 2. Contar los pedidos en curso (Asignados o Recogidos) para este repartidor usando una consulta preparada segura
        $sql_pedidos = "SELECT COUNT(*) as total FROM pedidos WHERE CedulaR = ? AND estado IN ('Asignado', 'Recogido')";
        $stmt_ped = $pdo->prepare($sql_pedidos);
        $stmt_ped->execute([$cedula]);
        $p_row = $stmt_ped->fetch();
        
        if ($p_row) {
            $total_pedidos = intval($p_row['total']);
        }

        $row['total_pedidos'] = $total_pedidos;
        $repartidores[] = $row;
    }

    // Devolver los datos en formato JSON asegurando codificación limpia
    echo json_encode($repartidores, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    // Si ocurre algún error en la base de datos, devolvemos un JSON vacío
    echo json_encode([]);
}
?>