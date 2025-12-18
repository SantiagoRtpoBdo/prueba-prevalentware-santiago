import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin, handleError } from '@/lib/api-helpers';
import { prisma } from '@/lib/auth';

/**
 * GET /api/users - Obtener todos los usuarios (solo admins)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGetUsers(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}

async function handleGetUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authResult = await requireAdmin(req, res);
    if (!authResult) return;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(users);
  } catch (error) {
    handleError(res, error);
  }
}
