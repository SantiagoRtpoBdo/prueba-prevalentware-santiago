import * as React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/atoms/Badge';
import { FinancialValue } from '@/components/atoms/FinancialValue';

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

interface TransactionsTableProps {
  transactions: Transaction[];
  emptyMessage?: string;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  emptyMessage = 'No hay transacciones',
}) => {
  if (transactions.length === 0) {
    return (
      <div className='py-12 text-center text-muted-foreground'>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
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
            <TableRow key={transaction.id} className='hover:bg-muted/50'>
              <TableCell className='text-sm text-muted-foreground'>
                {new Date(transaction.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell className='font-medium'>
                {transaction.concept}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    transaction.type === 'INCOME' ? 'success' : 'destructive'
                  }
                >
                  {transaction.type === 'INCOME' ? (
                    <>
                      <TrendingUp className='mr-1 h-3 w-3' />
                      Ingreso
                    </>
                  ) : (
                    <>
                      <TrendingDown className='mr-1 h-3 w-3' />
                      Egreso
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell className='text-right'>
                <FinancialValue
                  amount={transaction.amount}
                  type={transaction.type === 'INCOME' ? 'positive' : 'negative'}
                  showSign
                />
              </TableCell>
              <TableCell>
                <div className='text-sm'>
                  <div className='font-medium'>{transaction.user.name}</div>
                  <div className='text-muted-foreground'>
                    {transaction.user.email}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
