import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authClient } from '@/lib/auth/client';
import Layout from '@/components/Layout';
import type { ExtendedSession } from '@/types/session';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';

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

export default function Transactions() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
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
    } catch (error) {
      console.error('Error fetching transactions:', error);
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
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Error al crear la transacción');
    }
  };

  if (isPending || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const extendedSession = session as unknown as ExtendedSession;
  const isAdmin = extendedSession.user.role === 'ADMIN';

  return (
    <Layout user={extendedSession.user as any}>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900'>
              Gestión de Movimientos
            </h2>
            <p className='mt-2 text-gray-600'>
              Visualiza y administra los ingresos y egresos
            </p>
          </div>
          {isAdmin && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Nuevo Movimiento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nuevo Movimiento</DialogTitle>
                  <DialogDescription>
                    Registra un nuevo ingreso o egreso
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                    <Label htmlFor='concept'>Concepto</Label>
                    <Input
                      id='concept'
                      value={formData.concept}
                      onChange={(e) =>
                        setFormData({ ...formData, concept: e.target.value })
                      }
                      required
                      placeholder='Descripción del movimiento'
                    />
                  </div>
                  <div>
                    <Label htmlFor='amount'>Monto</Label>
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
                    />
                  </div>
                  <div>
                    <Label htmlFor='type'>Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'INCOME' | 'EXPENSE') =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='INCOME'>Ingreso</SelectItem>
                        <SelectItem value='EXPENSE'>Egreso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='date'>Fecha</Label>
                    <Input
                      id='date'
                      type='datetime-local'
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
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

        <Card>
          <CardHeader>
            <CardTitle>Lista de Movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                No hay transacciones registradas
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className='text-right'>Monto</TableHead>
                    <TableHead>Usuario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString(
                          'es-ES',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </TableCell>
                      <TableCell className='font-medium'>
                        {transaction.concept}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center'>
                          {transaction.type === 'INCOME' ? (
                            <>
                              <TrendingUp className='h-4 w-4 text-green-600 mr-2' />
                              <span className='text-green-600'>Ingreso</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className='h-4 w-4 text-red-600 mr-2' />
                              <span className='text-red-600'>Egreso</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='text-right font-semibold'>
                        <span
                          className={
                            transaction.type === 'INCOME'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {transaction.type === 'INCOME' ? '+' : '-'}$
                          {transaction.amount.toLocaleString('es-ES', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className='font-medium'>
                            {transaction.user.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {transaction.user.email}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
