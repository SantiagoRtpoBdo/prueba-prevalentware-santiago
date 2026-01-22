import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authClient } from '@/lib/auth/client';
import Layout from '@/components/Layout';
import type { ExtendedSession } from '@/types/session';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { StatCard } from '@/components/molecules/StatCard';
import { DataTableHeader } from '@/components/molecules/DataTableHeader';
import { TransactionsTable } from '@/components/organisms/TransactionsTable';

interface Transaction {
  id: string;
  concept: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const Transactions = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    concept: '',
    amount: '',
    type: 'INCOME' as 'INCOME' | 'EXPENSE',
    date: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/');
    } else if (session) {
      fetchTransactions();
    }
  }, [session, isPending, router]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          date: new Date(formData.date).toISOString(),
        }),
      });

      if (response.ok) {
        setDialogOpen(false);
        setFormData({
          concept: '',
          amount: '',
          type: 'INCOME',
          date: new Date().toISOString().slice(0, 16),
        });
        fetchTransactions();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al crear la transacción');
      }
    } catch {
      alert('Error al crear la transacción');
    }
  };

  if (isPending || loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const extendedSession = session as unknown as ExtendedSession;
  const isAdmin = extendedSession.user.role === 'ADMIN';

  const filteredTransactions = transactions.filter(
    (t) =>
      t.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const incomePercentage =
    totalIncome > 0
      ? ((totalIncome / (totalIncome + totalExpense)) * 100).toFixed(1)
      : '0';

  return (
    <Layout user={extendedSession.user}>
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
                <form onSubmit={handleSubmit} className='mt-4 space-y-5'>
                  <div>
                    <Label htmlFor='concept' className='text-sm font-semibold'>
                      Concepto
                    </Label>
                    <Input
                      id='concept'
                      value={formData.concept}
                      onChange={(e) =>
                        setFormData({ ...formData, concept: e.target.value })
                      }
                      required
                      placeholder='Ej: Pago de servicios'
                      className='mt-1.5'
                    />
                  </div>
                  <div>
                    <Label htmlFor='amount' className='text-sm font-semibold'>
                      Monto
                    </Label>
                    <Input
                      id='amount'
                      type='number'
                      step='0.01'
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      required
                      placeholder='0.00'
                      className='mt-1.5'
                    />
                  </div>
                  <div>
                    <Label htmlFor='type' className='text-sm font-semibold'>
                      Tipo de Movimiento
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'INCOME' | 'EXPENSE') =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger className='mt-1.5'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='INCOME'>
                          <div className='flex items-center gap-2'>
                            <TrendingUp className='h-4 w-4 text-success' />
                            <span>Ingreso</span>
                          </div>
                        </SelectItem>
                        <SelectItem value='EXPENSE'>
                          <div className='flex items-center gap-2'>
                            <TrendingDown className='h-4 w-4 text-destructive' />
                            <span>Egreso</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='date' className='text-sm font-semibold'>
                      Fecha y Hora
                    </Label>
                    <Input
                      id='date'
                      type='datetime-local'
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                      className='mt-1.5'
                    />
                  </div>
                  <Button type='submit' className='w-full'>
                    Guardar Movimiento
                  </Button>
                </form>
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
