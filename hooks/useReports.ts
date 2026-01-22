import { useState, useEffect, useCallback } from 'react';

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

export const useReports = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        setError('Error al cargar los reportes');
      }
    } catch (err) {
      setError('Error al cargar los reportes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const downloadCSV = useCallback(async () => {
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
        return { success: true };
      } else {
        return { success: false, error: 'Error al descargar el reporte' };
      }
    } catch {
      return { success: false, error: 'Error al descargar el reporte' };
    }
  }, []);

  return {
    reportData,
    loading,
    error,
    refetch: fetchReportData,
    downloadCSV,
  };
};
