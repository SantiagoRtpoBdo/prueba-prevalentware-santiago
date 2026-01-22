import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import Layout from '@/components/Layout';
import { PageLoader } from '@/components/templates/PageLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { StatCard } from '@/components/molecules/StatCard';
import { DataTableHeader } from '@/components/molecules/DataTableHeader';
import { TransactionsTable } from '@/components/organisms/TransactionsTable';
import { TransactionForm } from '@/components/organisms/TransactionForm';

const Transactions = () => {
  const { session, isPending, isAdmin, user } = useAuth();
  const {
    transactions,
    loading,
    createTransaction,
    totalIncome,
    totalExpense,
    balance,
  } = useTransactions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(
    () =>
      transactions.filter(
        (t) =>
          t.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [transactions, searchTerm]
  );

  const incomePercentage = useMemo(
    () =>
      totalIncome > 0
        ? ((totalIncome / (totalIncome + totalExpense || 1)) * 100).toFixed(1)
        : '0',
    [totalIncome, totalExpense]
  );

  const handleCreateTransaction = async (data: {
    concept: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    date: string;
  }) => {
    const result = await createTransaction(data);
    if (result.success) {
      setDialogOpen(false);
    }
    return result;
  };

  if (isPending || loading) {
    return <PageLoader />;
  }

  if (!session || !user) {
    return null;
  }

  return (
    <Layout user={user}>
      <div className='space-y-6 fade-in'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h2 className='text-3xl font-bold text-foreground'>
              Gestión de Movimientos
            </h2>
            <p className='mt-1 text-muted-foreground'>
              Visualiza y administra los ingresos y egresos
            </p>
          </div>
          {isAdmin && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size='lg' className='gap-2'>
                  <Plus className='h-5 w-5' />
                  Nuevo Movimiento
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-md'>
                <DialogHeader>
                  <DialogTitle className='text-2xl font-bold'>
                    Nuevo Movimiento
                  </DialogTitle>
                  <DialogDescription className='text-base'>
                    Registra un nuevo ingreso o egreso en el sistema
                  </DialogDescription>
                </DialogHeader>
                <div className='mt-4'>
                  <TransactionForm
                    onSubmit={handleCreateTransaction}
                    onSuccess={() => setDialogOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <StatCard
            title='Total Ingresos'
            value={`$${totalIncome.toLocaleString('es-ES', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            icon={<TrendingUp className='h-5 w-5' />}
            trend={{
              value: Number(incomePercentage),
              isPositive: true,
            }}
          />
          <StatCard
            title='Total Egresos'
            value={`$${totalExpense.toLocaleString('es-ES', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            icon={<TrendingDown className='h-5 w-5' />}
          />
          <StatCard
            title='Balance Total'
            value={`$${Math.abs(balance).toLocaleString('es-ES', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            icon={<TrendingUp className='h-5 w-5' />}
            trend={{
              value: balance,
              isPositive: balance >= 0,
            }}
          />
        </div>

        <Card className='shadow-professional'>
          <CardHeader>
            <DataTableHeader
              title='Transacciones'
              description={`${filteredTransactions.length} movimiento${
                filteredTransactions.length !== 1 ? 's' : ''
              }`}
              searchProps={{
                value: searchTerm,
                onChange: (value: string) => setSearchTerm(value),
                placeholder: 'Buscar por concepto o usuario...',
              }}
            />
          </CardHeader>
          <CardContent>
            <TransactionsTable
              transactions={filteredTransactions}
              emptyMessage={
                searchTerm
                  ? 'No se encontraron transacciones'
                  : 'No hay transacciones registradas'
              }
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Transactions;
