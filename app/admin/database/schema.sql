CREATE DATABASE IF NOT EXISTS tiendadb;
USE tiendadb;

CREATE TABLE IF NOT EXISTS categorias (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria VARCHAR(100) NOT NULL,
    imagen VARCHAR(255) NOT NULL DEFAULT '/placeholder.svg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria) REFERENCES categorias(nombre) ON UPDATE CASCADE
);

-- Datos iniciales para categorías
INSERT INTO categorias (nombre, descripcion) VALUES
    ('muebles', 'Categoría de muebles'),
    ('iluminación', 'Categoría de iluminación'),
    ('decoración', 'Categoría de decoración')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- Datos iniciales para productos
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen) VALUES
    ('Lámpara Vintage', 'Lámpara de mesa estilo vintage en excelente estado. Perfecta para dar un toque retro a cualquier habitación.', 45.99, 5, 'iluminación', '/images/lava10.jpg'),
    ('Silla de Diseñador', 'Silla de diseñador en madera y cuero. Muy cómoda y en perfecto estado.', 120.00, 3, 'muebles', '/images/lava10.jpg'),
    ('Mesa de Centro', 'Mesa de centro de cristal con base de madera. Elegante y funcional.', 85.50, 2, 'muebles', '/images/lava10.jpg'),
    ('Jarrón Decorativo', 'Jarrón decorativo de cerámica pintado a mano. Pieza única.', 35.25, 10, 'decoración', '/images/lava10.jpg')
ON DUPLICATE KEY UPDATE 
    descripcion = VALUES(descripcion),
    precio = VALUES(precio),
    stock = VALUES(stock),
    imagen = VALUES(imagen);