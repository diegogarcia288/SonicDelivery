

  <?php
  $conexion = mysqli_connect("localhost", "root", "", "sonic_delivery") or
    die("Problemas con la conexión");

  mysqli_query($conexion, "insert into repartidor(nombre,contrasena,fecha_nacimiento,telefono) values 
                       ('$_REQUEST[nombre]','$_REQUEST[contrasena]','$_REQUEST[fecha_nacimiento]',$_REQUEST[telefono])")
    or die("Problemas en el select" . mysqli_error($conexion));

  mysqli_close($conexion);

  header("Location: inicioRepartidor.html");
  exit();
  ?>


