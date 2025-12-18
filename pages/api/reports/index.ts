import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin, handleError } from '@/lib/api-helpers';
import { prisma } from '@/lib/auth';

/**
 * GET /api/reports - Obtener datos para reportes (solo admins)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGetReportData(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}

async function handleGetReportData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authResult = await requireAdmin(req, res);
    if (!authResult) return;

    const transactions = await prisma.transaction.findMany({
      orderBy: {
        date: 'asc',
      },
    });

    // Calcular totales
    const totalIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Agrupar por mes
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};

    transactions.forEach((transaction) => {
      const monthKey = new Date(transaction.date).toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }

      if (transaction.type === 'INCOME') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expense += transaction.amount;
      }
    });

    // Convertir a array para el gráfico
    const chartData = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    res.status(200).json({
      balance,
      totalIncome,
      totalExpense,
      monthlyData: chartData,
      transactionsCount: transactions.length,
    });
  } catch (error) {
    handleError(res, error);
  }
}
