import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

interface ReportsChartsProps {
  monthlyData: MonthlyData[];
}

const formatCurrency = (value: number | undefined) =>
  `$${(value || 0).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
  })}`;

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
};

export const ReportsCharts: React.FC<ReportsChartsProps> = ({
  monthlyData,
}) => {
  if (monthlyData.length === 0) {
    return (
      <Card className='shadow-professional'>
        <CardContent className='py-16'>
          <div className='text-center text-muted-foreground'>
            <p className='text-lg font-medium'>Sin Datos Disponibles</p>
            <p className='mt-2 text-sm'>
              No hay suficientes datos para generar gráficos. Comienza agregando
              transacciones para visualizar tus estadísticas.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className='shadow-professional'>
        <CardHeader>
          <CardTitle>Movimientos por Mes</CardTitle>
          <p className='text-sm text-muted-foreground'>
            Comparación de ingresos y egresos mensuales
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={350}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
              <XAxis dataKey='month' className='text-sm' />
              <YAxis className='text-sm' />
              <Tooltip contentStyle={tooltipStyle} formatter={formatCurrency} />
              <Legend className='pt-4 text-sm font-semibold' />
              <Bar
                dataKey='income'
                fill='hsl(var(--success))'
                name='Ingresos'
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey='expense'
                fill='hsl(var(--destructive))'
                name='Egresos'
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className='shadow-professional'>
        <CardHeader>
          <CardTitle>Tendencia de Movimientos</CardTitle>
          <p className='text-sm text-muted-foreground'>
            Evolución temporal de tus finanzas
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={350}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
              <XAxis dataKey='month' className='text-sm' />
              <YAxis className='text-sm' />
              <Tooltip contentStyle={tooltipStyle} formatter={formatCurrency} />
              <Legend className='pt-4 text-sm font-semibold' />
              <Line
                type='monotone'
                dataKey='income'
                stroke='hsl(var(--success))'
                strokeWidth={2}
                dot={{ r: 4 }}
                name='Ingresos'
              />
              <Line
                type='monotone'
                dataKey='expense'
                stroke='hsl(var(--destructive))'
                strokeWidth={2}
                dot={{ r: 4 }}
                name='Egresos'
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};
