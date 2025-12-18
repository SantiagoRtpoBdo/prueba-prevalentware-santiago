import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth/client';

const App = ({ Component, pageProps }: AppProps) => {
  // Inicializar el cliente de autenticación
  useEffect(() => {}, []);

  return <Component {...pageProps} />;
};

export default App;
