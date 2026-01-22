import React from 'react';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';

export const PageLoader: React.FC = () => (
  <div className='flex min-h-screen items-center justify-center bg-background'>
    <LoadingSpinner size='lg' />
  </div>
);
