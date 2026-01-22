import * as React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  className,
}: StatCardProps) => (
  <div
    className={cn(
      'bg-card border border-border rounded-lg p-6 shadow-subtle hover-card',
      className
    )}
  >
    <div className='flex items-start justify-between'>
      <div className='flex-1'>
        <p className='text-sm font-medium text-muted-foreground'>{title}</p>
        <h3 className='mt-2 text-3xl font-bold text-foreground'>{value}</h3>
        {trend && (
          <p
            className={cn(
              'mt-2 text-sm font-medium',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </p>
        )}
      </div>
      {icon && (
        <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary'>
          {icon}
        </div>
      )}
    </div>
  </div>
);
