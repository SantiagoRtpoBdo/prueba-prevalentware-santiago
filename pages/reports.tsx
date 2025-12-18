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
import { Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

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

export default function Reports() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/');
    } else if (session) {
      const extendedSession = session as unknown as ExtendedSession;
      if (extendedSession.user.role !== 'ADMIN') {
        router.push('/dashboard');
      } else {
        fetchReportData();
      }
    }
  }, [session, isPending, router]);

  const fetchReportData = async () => {
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
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
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error al descargar el reporte');
    } finally {
      setDownloading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session || (session as unknown as ExtendedSession).user.role !== 'ADMIN') {
    return null;
  }

  const extendedSession = session as unknown as ExtendedSession;

  return (
    <Layout user={extendedSession.user as any}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Reportes</h2>
            <p className="mt-2 text-gray-600">
              Visualiza estadísticas financieras y descarga reportes
            </p>
          </div>
          <Button onClick={handleDownloadCSV} disabled={downloading}>
            <Download className="mr-2 h-4 w-4" />
            {downloading ? 'Descargando...' : 'Descargar CSV'}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Actual</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${reportData?.balance.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {reportData?.transactionsCount} transacciones totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +${reportData?.totalIncome.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Suma de todos los ingresos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Egresos</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                -${reportData?.totalExpense.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Suma de todos los egresos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {reportData && reportData.monthlyData.length > 0 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Movimientos por Mes (Gráfico de Barras)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number | undefined) =>
                        value
                          ? `$${value.toLocaleString('es-ES', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : '$0.00'
                      }
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" name="Ingresos" />
                    <Bar dataKey="expense" fill="#ef4444" name="Egresos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Movimientos (Gráfico de Líneas)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number | undefined) =>
                        value
                          ? `$${value.toLocaleString('es-ES', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : '$0.00'
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Ingresos"
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Egresos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                No hay suficientes datos para generar gráficos
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
