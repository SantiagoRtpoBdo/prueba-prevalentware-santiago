import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {}, []);

  return <Component {...pageProps} />;
};

export default App;
