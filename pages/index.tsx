import { useEffect } from 'react';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Github } from 'lucide-react';

export default function Home() {
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      window.location.href = '/dashboard';
    }
  }, [session]);

  const handleGitHubLogin = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/dashboard',
    });
  };

  if (session) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>
            Sistema de Gestión Financiera
          </CardTitle>
          <CardDescription>
            Gestiona tus ingresos y egresos de manera eficiente
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text-center text-sm text-gray-600'>
            <p>Inicia sesión con tu cuenta de GitHub para continuar</p>
          </div>
          <Button onClick={handleGitHubLogin} className='w-full' size='lg'>
            <Github className='mr-2 h-5 w-5' />
            Iniciar sesión con GitHub
          </Button>
          <div className='text-xs text-center text-gray-500 mt-4'>
            <p>Al iniciar sesión, aceptas nuestros términos y condiciones</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
