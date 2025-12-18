import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, requireAdmin, handleError } from '@/lib/api-helpers';
import { prisma } from '@/lib/auth';

/**
 * GET /api/transactions - Obtener todas las transacciones
 * POST /api/transactions - Crear una nueva transacción (solo admins)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGetTransactions(req, res);
  } else if (req.method === 'POST') {
    return handleCreateTransaction(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}

async function handleGetTransactions(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authResult = await requireAuth(req, res);
    if (!authResult) return;

    const transactions = await prisma.transaction.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.status(200).json(transactions);
  } catch (error) {
    handleError(res, error);
  }
}

async function handleCreateTransaction(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authResult = await requireAdmin(req, res);
    if (!authResult) return;

    const { concept, amount, type, date } = req.body;

    // Validación de datos
    if (!concept || !amount || !type || !date) {
      return res.status(400).json({
        error: 'Todos los campos son requeridos: concept, amount, type, date',
      });
    }

    if (type !== 'INCOME' && type !== 'EXPENSE') {
      return res.status(400).json({
        error: 'El tipo debe ser INCOME o EXPENSE',
      });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        error: 'El monto debe ser un número positivo',
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        concept,
        amount,
        type,
        date: new Date(date),
        userId: authResult.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    handleError(res, error);
  }
}
