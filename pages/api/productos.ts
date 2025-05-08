import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria: string
  imagen: string
  createdAt?: Date
  updatedAt?: Date
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Producto | Producto[] | { error: string } | { message: string }>
) {
  // Configurar headers CORS
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'];
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Manejar la solicitud OPTIONS del preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.setHeader('Content-Type', 'application/json')

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const producto = await prisma.producto.findUnique({
            where: { id: req.query.id as string },
            include: { categoria: true }
          })
          
          if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' })
          }
          
          // Transformar el resultado para que coincida con la interfaz Producto
          const productoFormateado: Producto = {
            ...producto,
            categoria: producto.categoria?.nombre || 'Sin categoría'
          }
          
          return res.status(200).json(productoFormateado)
        } else {
          const productos = await prisma.producto.findMany({
            include: { categoria: true }
          })
          
          // Transformar los resultados para que coincidan con la interfaz Producto
          const productosFormateados: Producto[] = productos.map(p => ({
            ...p,
            categoria: p.categoria?.nombre || 'Sin categoría'
          }))
          
          return res.status(200).json(productosFormateados)
        }

      case 'POST':
        const { nombre, descripcion, precio, categoria, stock, imagen } = req.body

        if (!nombre || !descripcion || !precio || !categoria) {
          return res.status(400).json({ 
            error: 'Faltan campos requeridos: nombre, descripcion, precio y categoria son obligatorios' 
          })
        }

        const precioNum = Number(precio)
        if (isNaN(precioNum) || precioNum < 0) {
          return res.status(400).json({ error: 'El precio debe ser un número válido y positivo' })
        }

        const stockNum = Number(stock || 0)
        if (isNaN(stockNum) || stockNum < 0) {
          return res.status(400).json({ error: 'El stock debe ser un número válido y no negativo' })
        }

        // Crear o actualizar la categoría primero
        const categoriaCreada = await prisma.categoria.upsert({
          where: { nombre: categoria },
          update: {},
          create: {
            nombre: categoria,
            descripcion: `Categoría ${categoria}`
          }
        })

        // Crear el producto
        const nuevoProducto = await prisma.producto.create({
          data: {
            nombre,
            descripcion,
            precio: precioNum,
            stock: stockNum,
            categoriaId: categoriaCreada.id,
            imagen: imagen || '/placeholder.svg'
          },
          include: { categoria: true }
        })

        // Transformar el resultado
        const nuevoProductoFormateado: Producto = {
          ...nuevoProducto,
          categoria: nuevoProducto.categoria.nombre
        }

        return res.status(201).json(nuevoProductoFormateado)

      case 'PUT':
        const { id } = req.query
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'ID de producto no válido' })
        }

        const datosActualizacion = req.body
        if (datosActualizacion.precio) {
          datosActualizacion.precio = Number(datosActualizacion.precio)
          if (isNaN(datosActualizacion.precio) || datosActualizacion.precio < 0) {
            return res.status(400).json({ error: 'El precio debe ser un número válido y positivo' })
          }
        }

        if (datosActualizacion.stock !== undefined) {
          datosActualizacion.stock = Number(datosActualizacion.stock)
          if (isNaN(datosActualizacion.stock) || datosActualizacion.stock < 0) {
            return res.status(400).json({ error: 'El stock debe ser un número válido y no negativo' })
          }
        }

        let categoriaId: string | undefined
        if (datosActualizacion.categoria) {
          const categoria = await prisma.categoria.upsert({
            where: { nombre: datosActualizacion.categoria },
            update: {},
            create: {
              nombre: datosActualizacion.categoria,
              descripcion: `Categoría ${datosActualizacion.categoria}`
            }
          })
          categoriaId = categoria.id
        }

        const productoActualizado = await prisma.producto.update({
          where: { id },
          data: {
            ...datosActualizacion,
            categoriaId: categoriaId
          },
          include: { categoria: true }
        })

        // Transformar el resultado
        const productoActualizadoFormateado: Producto = {
          ...productoActualizado,
          categoria: productoActualizado.categoria.nombre
        }

        return res.status(200).json(productoActualizadoFormateado)

      case 'DELETE':
        const productId = req.query.id
        if (!productId || typeof productId !== 'string') {
          return res.status(400).json({ error: 'ID de producto no válido' })
        }

        await prisma.producto.delete({
          where: { id: productId }
        })

        return res.status(200).json({ message: 'Producto eliminado correctamente' })

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        return res.status(405).json({ error: `Método ${req.method} no permitido` })
    }
  } catch (error) {
    console.error('Error en el servidor:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}