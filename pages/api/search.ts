import type { NextApiRequest, NextApiResponse } from 'next';
web/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;web/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q, categoria } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Término de búsqueda requerido' });
  }

  try {
    const productos = await prisma.producto.findMany({
      where: {
        OR: [
          { nombre: { contains: q as string, mode: 'insensitive' } },
          { descripcion: { contains: q as string, mode: 'insensitive' } },
        ],
        ...(categoria && { categoria: categoria as string }),
      },
      include: {
        relacionados: true,
        categoriaRef: true,
      },
    });

    res.status(200).json(productos);
  } catch (error) {
    console.error('Error de búsqueda:', error);
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
}