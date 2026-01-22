import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TransactionFormData {
  concept: string;
  amount: string;
  type: 'INCOME' | 'EXPENSE';
  date: string;
}

interface TransactionFormProps {
  onSubmit: (data: {
    concept: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    date: string;
  }) => Promise<{ success: boolean; error?: string }>;
  onSuccess?: () => void;
  defaultValues?: Partial<TransactionFormData>;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  onSuccess,
  defaultValues,
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    concept: defaultValues?.concept || '',
    amount: defaultValues?.amount || '',
    type: defaultValues?.type || 'INCOME',
    date: defaultValues?.date || new Date().toISOString().slice(0, 16),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.concept || !formData.amount || !formData.date) {
      setError('Todos los campos son requeridos');
      setIsSubmitting(false);
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('El monto debe ser un número positivo');
      setIsSubmitting(false);
      return;
    }

    const result = await onSubmit({
      concept: formData.concept,
      amount,
      type: formData.type,
      date: formData.date,
    });

    if (result.success) {
      setFormData({
        concept: '',
        amount: '',
        type: 'INCOME',
        date: new Date().toISOString().slice(0, 16),
      });
      onSuccess?.();
    } else {
      setError(result.error || 'Error al crear la transacción');
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      {error && (
        <div className='p-3 rounded-lg text-sm bg-destructive/10 text-destructive border border-destructive/20'>
          {error}
        </div>
      )}

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
          disabled={isSubmitting}
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
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
          placeholder='0.00'
          className='mt-1.5'
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          className='mt-1.5'
          disabled={isSubmitting}
        />
      </div>

      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar Movimiento'}
      </Button>
    </form>
  );
};
