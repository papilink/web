import { PrismaClient, Producto, Categoria } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    // Limpiar la base de datos primero
    await prisma.producto.deleteMany()
    await prisma.categoria.deleteMany()

    // Crear categorías
    console.log('Creando categorías...')
    const categorias = await Promise.all([
      prisma.categoria.create({
        data: {
          nombre: 'Notebooks',
          descripcion: 'Computadoras portátiles y accesorios'
        }
      }),
      prisma.categoria.create({
        data: {
          nombre: 'PC desktop',
          descripcion: 'Computadoras de escritorio y componentes'
        }
      }),
      prisma.categoria.create({
        data: {
          nombre: 'Lavarropas',
          descripcion: 'Lavarropas y electrodomésticos'
        }
      })
    ])

    const [notebooks, pcDesktop, lavarropas] = categorias

    // Crear productos
    console.log('Creando productos...')
    const productos = await Promise.all([
      prisma.producto.create({
        data: {
          nombre: 'Notebook Lenovo ThinkPad',
          descripcion: 'Laptop empresarial de alta gama con procesador Intel i7',
          precio: 899.99,
          stock: 10,
          imagen: '/images/placeholder.jpg',
          categoria: {
            connect: {
              id: notebooks.id
            }
          }
        }
      }),
      prisma.producto.create({
        data: {
          nombre: 'PC Gamer RGB',
          descripcion: 'Computadora de escritorio para gaming con RTX 3070',
          precio: 1499.99,
          stock: 5,
          imagen: '/images/placeholder.jpg',
          categoria: {
            connect: {
              id: pcDesktop.id
            }
          }
        }
      }),
      prisma.producto.create({
        data: {
          nombre: 'Lavarropas Samsung 12kg',
          descripcion: 'Lavarropas automático con tecnología EcoBubble',
          precio: 699.99,
          stock: 8,
          imagen: '/images/placeholder.jpg',
          categoria: {
            connect: {
              id: lavarropas.id
            }
          }
        }
      })
    ])

    console.log('Base de datos poblada con éxito')
    console.log(`Categorías creadas: ${categorias.length}`)
    console.log(`Productos creados: ${productos.length}`)
  } catch (error) {
    console.error('Error durante el seed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Error al poblar la base de datos:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })