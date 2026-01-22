import { useState, useEffect, useCallback } from 'react';

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

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else {
        setError('Error al cargar las transacciones');
      }
    } catch (err) {
      setError('Error al cargar las transacciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = useCallback(
    async (transactionData: {
      concept: string;
      amount: number;
      type: 'INCOME' | 'EXPENSE';
      date: string;
    }) => {
      try {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...transactionData,
            date: new Date(transactionData.date).toISOString(),
          }),
        });

        if (response.ok) {
          await fetchTransactions();
          return { success: true };
        } else {
          const error = await response.json();
          return { success: false, error: error.error || 'Error al crear la transacción' };
        }
      } catch {
        return { success: false, error: 'Error al crear la transacción' };
      }
    },
    [fetchTransactions]
  );

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    createTransaction,
    totalIncome,
    totalExpense,
    balance,
  };
};
