<?php

$host     = "localhost";
$usuario  = "root";
$password = ""; // Contraseña Servidor XAMPP
$database = "sonic_delivery"; // Nombre de la base de datos

// Se crea la conexión a la base de datos
$conexion = new mysqli($host, $usuario, $password, $database);

// Se verifica la conexión a la base de datos
if ($conexion->connect_error) {
    die("Error de conexión a la base de datos: " . $conexion->connect_error); 
}

// Asegurar que los caracteres especiales (tildes, ñ) se lean bien
$conexion->set_charset("utf8mb4");
?>