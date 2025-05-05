import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

interface Producto {
  id: string;
  nombre: string;
  // ...otros campos
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Producto[] | { error: string }>
) {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        categoriaRef: true,
      },
    })
    res.json(productos)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error al obtener productos' })
  }
}