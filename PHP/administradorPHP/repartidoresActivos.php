<?php
// Ocultar cualquier error en pantalla para proteger la salida JSON
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');

// Incluir la conexión subiendo un nivel desde administradorPHP hacia PHP/
if (file_exists('../conexion.php')) {
    include('../conexion.php');
} elseif (file_exists('conexion.php')) {
    include('conexion.php');
}

if (!isset($conexion) || $conexion->connect_error) {
    echo json_encode([]);
    exit;
}

$repartidores = [];

// 1. Consultar únicamente los repartidores activos
$sql = "SELECT CedulaR AS id, nombre, estado FROM repartidor WHERE estado = 'Activo'";
$resultado = $conexion->query($sql);

if ($resultado) {
    while ($row = $resultado->fetch_assoc()) {
        $cedula = $row['id'];
        $total_pedidos = 0;

        // 2. Contar los pedidos en curso (Asignados o Recogidos) para este repartidor
        $sql_pedidos = "SELECT COUNT(*) as total FROM pedidos WHERE CedulaR = '$cedula' AND estado IN ('Asignado', 'Recogido')";
        $res_ped = $conexion->query($sql_pedidos);
        
        if ($res_ped) {
            $p_row = $res_ped->fetch_assoc();
            $total_pedidos = intval($p_row['total']);
        }

        $row['total_pedidos'] = $total_pedidos;
        $repartidores[] = $row;
    }
}

echo json_encode($repartidores);

if (isset($conexion)) {
    $conexion->close();
}
?>