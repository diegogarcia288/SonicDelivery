<?php
$host     = "localhost";
$usuario  = "root";
$password = ""; // Contraseña Servidor XAMPP
$database = "sonic_delivery"; // Nombre de la base de datos
$charset  = "utf8mb4";

$dsn = "mysql:host=$host;dbname=$database;charset=$charset";

$opciones = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false, // Vital para bloquear Inyección SQL real
];

try {
    $pdo = new PDO($dsn, $usuario, $password, $opciones);
} catch (\PDOException $e) {
    die("Error de conexión a la base de datos. Por favor, intente más tarde.");
}
?>