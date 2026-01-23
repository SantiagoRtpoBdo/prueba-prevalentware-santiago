import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin, handleError } from '@/lib/api-helpers';
import { prisma } from '@/lib/prisma';
import { withPrismaErrorHandling } from '@/lib/prisma-error-handler';

/**
 * GET /api/reports - Obtener datos para reportes (solo admins)
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return handleGetReportData(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
};

const handleGetReportData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const authResult = await requireAdmin(req, res);
    if (!authResult) return;

    const [incomeResult, expenseResult, transactions] =
      await withPrismaErrorHandling(async () =>
        Promise.all([
          prisma.transaction.aggregate({
            where: { type: 'INCOME' },
            _sum: { amount: true },
          }),
          prisma.transaction.aggregate({
            where: { type: 'EXPENSE' },
            _sum: { amount: true },
          }),
          prisma.transaction.findMany({
            orderBy: { date: 'desc' },
          }),
        ])
      );
    const totalIncome = incomeResult._sum.amount || 0;
    const totalExpense = expenseResult._sum.amount || 0;
    const balance = totalIncome - totalExpense;
    const transactionsCount = transactions.length;

    const monthlyMap = new Map<string, { income: number; expense: number }>();

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { income: 0, expense: 0 });
      }

      const monthData = monthlyMap.get(month)!;
      if (transaction.type === 'INCOME') {
        monthData.income += transaction.amount;
      } else {
        monthData.expense += transaction.amount;
      }
    });

    const chartData = Array.from(monthlyMap.entries())
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
      transactionsCount,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export default handler;
