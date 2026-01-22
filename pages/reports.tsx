import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authClient } from '@/lib/auth/client';
import Layout from '@/components/Layout';
import type { ExtendedSession } from '@/types/session';
import { Button } from '@/components/ui/button';
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
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { StatCard } from '@/components/molecules/StatCard';

interface ReportData {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  monthlyData: {
    month: string;
    income: number;
    expense: number;
  }[];
  transactionsCount: number;
}

const Reports = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const checkAuthAndFetch = () => {
    if (isPending) return;

    if (!session) {
      router.push('/');
      return;
    }

    const extendedSession = session as unknown as ExtendedSession;
    if (extendedSession.user.role !== 'ADMIN') {
      router.push('/dashboard');
    } else {
      fetchReportData();
    }
  };

  useEffect(() => {
    checkAuthAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, isPending, router]);

  const fetchReportData = async () => {
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    setDownloading(true);
    try {
      const response = await fetch('/api/reports/csv');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte-transacciones.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Error al descargar el reporte');
      }
    } catch {
      alert('Error al descargar el reporte');
    } finally {
      setDownloading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (
    !session ||
    (session as unknown as ExtendedSession).user.role !== 'ADMIN'
  ) {
    return null;
  }

  const extendedSession = session as unknown as ExtendedSession;

  return (
    <Layout user={extendedSession.user}>
      <div className='space-y-6 fade-in'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h2 className='text-3xl font-bold text-foreground'>
              Reportes Financieros
            </h2>
            <p className='mt-1 text-muted-foreground'>
              Visualiza estadísticas financieras y descarga reportes detallados
            </p>
          </div>
          <Button
            onClick={handleDownloadCSV}
            disabled={downloading}
            size='lg'
            className='gap-2'
          >
            <Download className='h-5 w-5' />
            {downloading ? 'Descargando...' : 'Descargar CSV'}
          </Button>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <StatCard
            title='Balance Neto'
            value={`$${Math.abs(reportData?.balance || 0).toLocaleString(
              'es-ES',
              {
                minimumFractionDigits: 2,
              }
            )}`}
            icon={<DollarSign className='h-5 w-5' />}
            trend={{
              value: reportData?.balance || 0,
              isPositive: (reportData?.balance || 0) >= 0,
            }}
          />
          <StatCard
            title='Total Ingresos'
            value={`$${(reportData?.totalIncome || 0).toLocaleString('es-ES', {
              minimumFractionDigits: 2,
            })}`}
            icon={<TrendingUp className='h-5 w-5' />}
          />
          <StatCard
            title='Total Egresos'
            value={`$${(reportData?.totalExpense || 0).toLocaleString('es-ES', {
              minimumFractionDigits: 2,
            })}`}
            icon={<TrendingDown className='h-5 w-5' />}
          />
        </div>

        {reportData && reportData.monthlyData.length > 0 ? (
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
                  <BarChart data={reportData.monthlyData}>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      className='opacity-30'
                    />
                    <XAxis dataKey='month' className='text-sm' />
                    <YAxis className='text-sm' />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number | undefined) =>
                        `$${(value || 0).toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                        })}`
                      }
                    />
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
                  <LineChart data={reportData.monthlyData}>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      className='opacity-30'
                    />
                    <XAxis dataKey='month' className='text-sm' />
                    <YAxis className='text-sm' />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number | undefined) =>
                        `$${(value || 0).toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                        })}`
                      }
                    />
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
        ) : (
          <Card className='shadow-professional'>
            <CardContent className='py-16'>
              <div className='text-center text-muted-foreground'>
                <p className='text-lg font-medium'>Sin Datos Disponibles</p>
                <p className='mt-2 text-sm'>
                  No hay suficientes datos para generar gráficos. Comienza
                  agregando transacciones para visualizar tus estadísticas.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
