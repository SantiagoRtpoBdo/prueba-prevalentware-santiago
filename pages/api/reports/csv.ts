import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin, handleError } from '@/lib/api-helpers';
import { prisma } from '@/lib/prisma';
import { withPrismaErrorHandling } from '@/lib/prisma-error-handler';

/**
 * GET /api/reports/csv - Descargar reporte en CSV (solo admins)
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return handleDownloadCSV(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
};

const handleDownloadCSV = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const authResult = await requireAdmin(req, res);
    if (!authResult) return;

    const transactions = await withPrismaErrorHandling(async () => {
      return prisma.transaction.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      });
    });

    // Crear CSV
    const headers = ['Fecha', 'Concepto', 'Tipo', 'Monto', 'Usuario', 'Email'];
    const csvRows = [headers.join(',')];

    transactions.forEach((transaction) => {
      const row = [
        new Date(transaction.date).toLocaleDateString('es-ES'),
        `"${transaction.concept}"`,
        transaction.type === 'INCOME' ? 'Ingreso' : 'Egreso',
        transaction.amount.toString(),
        `"${transaction.user.name}"`,
        transaction.user.email,
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte-transacciones.csv'
    );
    res.status(200).send('\uFEFF' + csvContent);
  } catch (error) {
    handleError(res, error);
  }
};

export default handler;
