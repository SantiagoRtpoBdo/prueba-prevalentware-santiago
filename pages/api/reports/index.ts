import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin, handleError } from '@/lib/api-helpers';
import { prisma } from '@/lib/auth';

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

    // Optimizar: usar SQL raw para agrupar por mes directamente en la base de datos
    const [
      incomeResult,
      expenseResult,
      transactionsCount,
      monthlyIncome,
      monthlyExpense,
    ] = await Promise.all([
      prisma.transaction.aggregate({
        where: { type: 'INCOME' },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { type: 'EXPENSE' },
        _sum: { amount: true },
      }),
      prisma.transaction.count(),
      // Agrupar ingresos por mes usando SQL raw para mejor rendimiento
      prisma.$queryRaw<Array<{ month: string; total: number }>>`
        SELECT 
          TO_CHAR(date, 'YYYY-MM') as month,
          SUM(amount)::float as total
        FROM transaction
        WHERE type = 'INCOME'
        GROUP BY TO_CHAR(date, 'YYYY-MM')
        ORDER BY month ASC
      `,
      // Agrupar egresos por mes usando SQL raw
      prisma.$queryRaw<Array<{ month: string; total: number }>>`
        SELECT 
          TO_CHAR(date, 'YYYY-MM') as month,
          SUM(amount)::float as total
        FROM transaction
        WHERE type = 'EXPENSE'
        GROUP BY TO_CHAR(date, 'YYYY-MM')
        ORDER BY month ASC
      `,
    ]);

    const totalIncome = incomeResult._sum.amount || 0;
    const totalExpense = expenseResult._sum.amount || 0;
    const balance = totalIncome - totalExpense;

    // Combinar datos mensuales de ingresos y egresos
    const monthlyMap = new Map<string, { income: number; expense: number }>();

    monthlyIncome.forEach((item) => {
      monthlyMap.set(item.month, { income: Number(item.total), expense: 0 });
    });

    monthlyExpense.forEach((item) => {
      const existing = monthlyMap.get(item.month);
      if (existing) {
        existing.expense = Number(item.total);
      } else {
        monthlyMap.set(item.month, { income: 0, expense: Number(item.total) });
      }
    });

    // Convertir a array ordenado
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
