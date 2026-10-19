CREATE DATABASE IF NOT EXISTS sonic_delivery
USE sonic_delivery;

CREATE TABLE repartidor {

cedular INT PRIMARY KEY,
nombre VARCHAR(50) NOT NULL,
contrasena VARCHAR(50) NOT NULL,
telefono VARCHAR(15) NOT NULL,
estado boolean NOT NULL DEFAULT FALSE

}

CREATE TABLE Administrador {

ID INT PRIMARY KEY,
nombre VARCHAR(50) NOT NULL,
contraseña VARCHAR(255) NOT NULL,
telefono VARCHAR(20),
cedularR VARCHAR(20),
CONSTRAINT fk_admin_repartidor FOREIGN KEY (cedularR) REFERENCES Repartidor(CedulaR)

}

CREATE TABLE Pedidos {

    ID_pedido INT PRIMARY KEY,
    CedulaR VARCHAR(20),
    comercioP VARCHAR(50),
    estado VARCHAR(20),
    CONSTRAINT fk_pedido_repartidor FOREIGN KEY (CedulaR) REFERENCES Repartidor(CedulaR)

}


CREATE TABLE Comercio {

    UsuarioComercio VARCHAR(50) PRIMARY KEY,
    direccionC VARCHAR(100),
    emailC VARCHAR(100),
    contraseña VARCHAR(255) NOT NULL,
    ID_pedido INT,
    CONSTRAINT fk_comercio_pedido FOREIGN KEY (ID_pedido) REFERENCES Pedidos(ID_pedido)

}

ALTER TABLE Pedidos
ADD CONSTRAINT fk_pedido_comercio FOREIGN KEY (comercioP) REFERENCES Comercio(UsuarioComercio);
