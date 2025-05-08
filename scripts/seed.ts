import { db } from '../lib/db';

async function main() {
  // Crear categorías
  const categorias = [
    { nombre: 'Notebooks', descripcion: 'Laptops y notebooks portátiles' },
    { nombre: 'PCs desktop', descripcion: 'Computadoras de escritorio' },
    { nombre: 'Lavarropas', descripcion: 'Lavarropas y electrodomésticos de lavado' }
  ];

  for (const categoria of categorias) {
    await db.categoria.create({
      data: categoria
    });
  }

  // Crear productos
  const productos = [
    {
      nombre: 'Notebook ThinkPad E14',
      descripcion: 'Notebook Lenovo ThinkPad E14 con Intel Core i5, 16GB RAM, 512GB SSD',
      precio: 599.99,
      stock: 10,
      categoria: 'Notebooks',
      imagen: '/images/placeholder.jpg'
    },
    {
      nombre: 'PC Gamer Pro',
      descripcion: 'PC Desktop gaming con RTX 3060, Ryzen 5, 16GB RAM',
      precio: 1299.99,
      stock: 5,
      categoria: 'PCs desktop',
      imagen: '/images/placeholder.jpg'
    },
    {
      nombre: 'Lavarropas Automático 8kg',
      descripcion: 'Lavarropas automático con 8kg de capacidad, múltiples programas',
      precio: 299.99,
      stock: 8,
      categoria: 'Lavarropas',
      imagen: '/images/placeholder.jpg'
    }
  ];

  for (const producto of productos) {
    // Primero buscar o crear la categoría
    const categoria = await db.categoria.upsert({
      where: { nombre: producto.categoria },
      update: {},
      create: {
        nombre: producto.categoria,
        descripcion: `Categoría ${producto.categoria}`
      }
    });

    // Luego crear el producto con la referencia a la categoría
    await db.producto.create({
      data: {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        categoriaId: categoria.id,
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