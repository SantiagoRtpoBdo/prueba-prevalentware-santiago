import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useReports } from '@/hooks/useReports';
import Layout from '@/components/Layout';
import { PageLoader } from '@/components/templates/PageLoader';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/molecules/StatCard';
import { ReportsCharts } from '@/components/organisms/ReportsCharts';

const Reports = () => {
  const { session, isPending, isAdmin, user } = useAuth({ requireAdmin: true });
  const { reportData, loading, downloadCSV } = useReports();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadCSV = async () => {
    setDownloading(true);
    const result = await downloadCSV();
    if (!result.success) {
      alert(result.error || 'Error al descargar el reporte');
    }
    setDownloading(false);
  };

  if (isPending || loading) {
    return <PageLoader />;
  }

  if (!session || !isAdmin || !user) {
    return null;
  }

  return (
    <Layout user={user}>
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

        {reportData && <ReportsCharts monthlyData={reportData.monthlyData} />}
      </div>
    </Layout>
  );
};

export default Reports;
