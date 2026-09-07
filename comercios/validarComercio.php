<?php
$conexion = mysqli_connect("localhost", "root", "", "sonic_delivery") or 
    die("Problemas con la conexión");


$nombre = $_POST['nombre_comercio'];
$pass   = $_POST['contrasena'];


$consulta = "SELECT * FROM comercio WHERE nombre='$nombre' AND contrasena='$pass'";
$resultado = mysqli_query($conexion, $consulta);


if (mysqli_num_rows($resultado) > 0) {

    header("Location: ../Principal.html"); 
    exit();
} else {

    echo "<script>alert('Datos incorrectos. El comercio no existe.'); window.location='inicioComercio.html';</script>";
}

mysqli_close($conexion);
?>