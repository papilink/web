import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Configurar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Manejar la solicitud OPTIONS del preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { id } = req.query

  if (req.method === 'DELETE') {
    try {
      await prisma.producto.delete({
        where: {
          id: id as string
        }
      })
      res.status(200).json({ message: 'Producto eliminado correctamente' })
    } catch (error) {
      console.error('Error al eliminar el producto:', error)
      res.status(500).json({ error: 'Error al eliminar el producto' })
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' })
  }
}