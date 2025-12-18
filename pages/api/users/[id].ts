import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin, handleError } from '@/lib/api-helpers';
import { prisma } from '@/lib/auth';

/**
 * PUT /api/users/[id] - Actualizar un usuario (solo admins)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    return handleUpdateUser(req, res);
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}

async function handleUpdateUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authResult = await requireAdmin(req, res);
    if (!authResult) return;

    const { id } = req.query;
    const { name, role, phone } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    // Validación de rol
    if (role && role !== 'USER' && role !== 'ADMIN') {
      return res.status(400).json({
        error: 'El rol debe ser USER o ADMIN',
      });
    }

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id },
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

    res.status(200).json(updatedUser);
  } catch (error) {
    handleError(res, error);
  }
}
