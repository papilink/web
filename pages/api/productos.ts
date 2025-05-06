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
  res.setHeader('Content-Type', 'application/json')

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const producto = await prisma.producto.findUnique({
            where: { id: req.query.id as string },
            include: { categoriaRef: true }
          })
          
          if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' })
          }
          
          return res.status(200).json(producto)
        } else {
          const productos = await prisma.producto.findMany({
            include: { categoriaRef: true }
          })
          return res.status(200).json(productos)
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
        await prisma.categoria.upsert({
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
            categoria,
            imagen: imagen || '/placeholder.svg'
          },
          include: { categoriaRef: true }
        })

        return res.status(201).json(nuevoProducto)

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

        if (datosActualizacion.categoria) {
          await prisma.categoria.upsert({
            where: { nombre: datosActualizacion.categoria },
            update: {},
            create: {
              nombre: datosActualizacion.categoria,
              descripcion: `Categoría ${datosActualizacion.categoria}`
            }
          })
        }

        const productoActualizado = await prisma.producto.update({
          where: { id },
          data: datosActualizacion,
          include: { categoriaRef: true }
        })

        return res.status(200).json(productoActualizado)

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