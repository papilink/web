import { db } from '../lib/db';

async function main() {
  // Crear categorías
  const categorias = [
    { nombre: 'Electrónica', descripcion: 'Productos electrónicos y gadgets' },
    { nombre: 'Hogar', descripcion: 'Artículos para el hogar' },
    { nombre: 'Ropa', descripcion: 'Vestimenta y accesorios' }
  ];

  for (const categoria of categorias) {
    await db.categoria.create({
      data: categoria
    });
  }

  // Crear productos
  const productos = [
    {
      nombre: 'Smartphone X',
      descripcion: 'Teléfono de última generación',
      precio: 599.99,
      stock: 10,
      categoria: 'Electrónica',
      imagen: '/images/placeholder.jpg'
    },
    {
      nombre: 'Laptop Pro',
      descripcion: 'Portátil para profesionales',
      precio: 1299.99,
      stock: 5,
      categoria: 'Electrónica',
      imagen: '/images/placeholder.jpg'
    },
    {
      nombre: 'Aspiradora Smart',
      descripcion: 'Aspiradora robótica inteligente',
      precio: 299.99,
      stock: 8,
      categoria: 'Hogar',
      imagen: '/images/placeholder.jpg'
    }
  ];

  for (const producto of productos) {
    await db.producto.create({
      data: {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        categoria: producto.categoria,
        imagen: producto.imagen
      }
    });
  }

  console.log('Base de datos poblada con éxito');
}

main()
  .catch((e) => {
    console.error('Error al poblar la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });