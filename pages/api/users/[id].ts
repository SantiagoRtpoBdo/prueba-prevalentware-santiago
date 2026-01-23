import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin, handleError } from '@/lib/api-helpers';
import { prisma } from '@/lib/prisma';
import { withPrismaErrorHandling } from '@/lib/prisma-error-handler';

/**
 * PUT /api/users/[id] - Actualizar un usuario (solo admins)
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    return handleUpdateUser(req, res);
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
};

const validateUserId = (id: string | string[] | undefined) => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  return true;
};

const validateRole = (role: string | undefined) => {
  if (role && role !== 'USER' && role !== 'ADMIN') {
    return false;
  }
  return true;
};

const handleUpdateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const authResult = await requireAdmin(req, res);
    if (!authResult) return;

    const { id } = req.query;
    const { name, role, phone } = req.body;

    if (!validateUserId(id)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    if (!validateRole(role)) {
      return res.status(400).json({ error: 'El rol debe ser USER o ADMIN' });
    }

    const updatedUser = await withPrismaErrorHandling(async () => {
      const existingUser = await prisma.user.findUnique({
        where: { id: id as string },
      });

      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }

      return prisma.user.update({
        where: { id: id as string },
        data: {
          ...(name && { name }),
          ...(role && { role }),
          ...(phone !== undefined && { phone }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    handleError(res, error);
  }
};

export default handler;
