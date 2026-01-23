import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, requireAdmin, handleError } from '@/lib/api-helpers';
import { prisma } from '@/lib/prisma';
import { withPrismaErrorHandling } from '@/lib/prisma-error-handler';

/**
 * GET /api/transactions - Obtener todas las transacciones
 * POST /api/transactions - Crear una nueva transacción (solo admins)
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return handleGetTransactions(req, res);
  } else if (req.method === 'POST') {
    return handleCreateTransaction(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
};

const handleGetTransactions = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const authResult = await requireAuth(req, res);
    if (!authResult) return;

    const transactions = await withPrismaErrorHandling(async () =>
      prisma.transaction.findMany({
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
      })
    );

    res.status(200).json(transactions);
  } catch (error) {
    handleError(res, error);
  }
};

const validateTransactionData = (body: {
  concept?: string;
  amount?: number;
  type?: string;
  date?: string;
}) => {
  const { concept, amount, type, date } = body;

  if (!concept || !amount || !type || !date) {
    return 'Todos los campos son requeridos: concept, amount, type, date';
  }

  if (type !== 'INCOME' && type !== 'EXPENSE') {
    return 'El tipo debe ser INCOME o EXPENSE';
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return 'El monto debe ser un número positivo';
  }

  return null;
};

const handleCreateTransaction = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const authResult = await requireAdmin(req, res);
    if (!authResult) return;

    const validationError = validateTransactionData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { concept, amount, type, date } = req.body;

    const transaction = await withPrismaErrorHandling(async () =>
      prisma.transaction.create({
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
      })
    );

    res.status(201).json(transaction);
  } catch (error) {
    handleError(res, error);
  }
};

export default handler;
