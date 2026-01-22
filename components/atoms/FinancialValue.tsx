import * as React from 'react';
import { cn } from '@/lib/utils';

interface FinancialValueProps {
  amount: number;
  type?: 'positive' | 'negative' | 'neutral';
  showSign?: boolean;
  currency?: string;
  className?: string;
}

export const FinancialValue = ({
  amount,
  type = 'neutral',
  showSign = false,
  currency = '$',
  className,
}: FinancialValueProps) => {
  const formattedAmount = amount.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const getSign = () => {
    if (!showSign) return '';
    return amount >= 0 ? '+' : '';
  };

  const getColorClass = () => {
    if (type === 'positive') return 'text-success';
    if (type === 'negative') return 'text-destructive';
    return 'text-foreground';
  };

  return (
    <span
      className={cn('font-semibold tabular-nums', getColorClass(), className)}
    >
      {getSign()}
      {currency}
      {formattedAmount}
    </span>
  );
};
