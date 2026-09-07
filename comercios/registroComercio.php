
  <?php
  $conexion = mysqli_connect("localhost", "root", "", "sonic_delivery") or
    die("Problemas con la conexión");

  mysqli_query($conexion, "insert into comercio(nombre,direccion,correo,contrasena) values 
                       ('$_REQUEST[nombre]','$_REQUEST[direccion]','$_REQUEST[correo]','$_REQUEST[contrasena]')")
    or die("Problemas en el select" . mysqli_error($conexion));

  mysqli_close($conexion);

  header("Location: inicioComercio.html");
  exit();
  ?>
