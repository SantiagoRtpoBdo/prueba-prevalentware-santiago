import * as React from 'react';

interface DataTableHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  searchProps?: {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
  };
}

export const DataTableHeader = ({
  title,
  description,
  action,
  searchProps,
}: DataTableHeaderProps) => (
  <div className='mb-6'>
    <div className='flex items-center justify-between mb-4'>
      <div>
        <h2 className='text-2xl font-bold text-foreground'>{title}</h2>
        {description && (
          <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
    {searchProps && (
      <div className='relative'>
        <input
          type='text'
          placeholder={searchProps.placeholder}
          value={searchProps.value}
          onChange={(e) => searchProps.onChange(e.target.value)}
          className='w-full rounded-lg border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-fast'
        />
      </div>
    )}
  </div>
);
