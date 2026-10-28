<?php
include('conexion.php');

// Recibir los datos enviados por POST desde el formulario
$detalle = $_POST['Detalles'];
$direccion = $_POST['Direccion'];
$comercio = $_POST['Comercio'];
$estado = 'Activo'; // Estado inicial para que aparezca en la lista de disponibles

// Insertar omitiendo CedulaR (quedará como NULL automáticamente)
$sql = "INSERT INTO pedidos (comercioP, detalle, direccion, estado) VALUES (?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);

if ($stmt) {
    // 'ssss' indica 4 parámetros de tipo texto (string)
    $stmt->bind_param("ssss", $comercio, $detalle, $direccion, $estado);

    if ($stmt->execute()) {
        // Redirigir de regreso al formulario con éxito (o a donde prefieras)
        header("Location: ../comercios/RealizaP.html?exito=1");
    } else {
        echo "Error al registrar el pedido: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Error en la preparación de la consulta: " . $conexion->error;
}

$conexion->close();
?>