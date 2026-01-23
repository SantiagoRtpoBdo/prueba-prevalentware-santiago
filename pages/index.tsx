import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authClient } from '@/lib/auth/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Building2,
  Loader2,
  TrendingUp,
  Shield,
  BarChart3,
} from 'lucide-react';
import { AuthTabs } from '@/components/organisms/AuthTabs';

const Home = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  const handleEmailLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/dashboard',
      });

      if (result.error) {
        setMessage({
          type: 'error',
          text:
            result.error.message ||
            'Error al iniciar sesión. Verifica tus credenciales.',
        });
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'Error al iniciar sesión. Por favor intenta nuevamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailRegister = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    setIsLoading(true);
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Las contraseñas no coinciden',
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage({
        type: 'error',
        text: 'La contraseña debe tener al menos 8 caracteres',
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: '/dashboard',
      });

      if (result.error) {
        setMessage({
          type: 'error',
          text: result.error.message || 'Error al crear la cuenta',
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Cuenta creada exitosamente. Por favor verifica tu correo electrónico.',
        });
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'Error al crear la cuenta. Por favor intenta nuevamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/dashboard',
      });
    } catch {
      setMessage({
        type: 'error',
        text: 'Error al conectar con GitHub',
      });
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (session) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin text-primary mx-auto' />
          <p className='mt-4 text-muted-foreground'>
            Redirigiendo al dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      {/* Header */}
      <header className='border-b bg-card'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
              <Building2 className='h-6 w-6 text-primary' />
            </div>
            <div>
              <h1 className='text-xl font-bold text-foreground'>
                Sistema de Gestión Financiera
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-12 flex-1'>
        <div className='grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto'>
          {/* Left side - Features */}
          <div className='space-y-8'>
            <div className='space-y-4'>
              <h2 className='text-4xl font-bold text-foreground'>
                Administra tus finanzas de manera profesional
              </h2>
              <p className='text-lg text-muted-foreground'>
                Sistema completo de gestión financiera con tecnología de última
                generación
              </p>
            </div>

            <div className='space-y-4'>
              <div className='flex gap-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 shrink-0'>
                  <TrendingUp className='h-6 w-6 text-success' />
                </div>
                <div>
                  <h3 className='font-semibold text-foreground mb-1'>
                    Control Total
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Monitorea cada movimiento financiero en tiempo real
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0'>
                  <BarChart3 className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <h3 className='font-semibold text-foreground mb-1'>
                    Reportes Avanzados
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Visualiza tus finanzas con gráficos interactivos
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 shrink-0'>
                  <Shield className='h-6 w-6 text-destructive' />
                </div>
                <div>
                  <h3 className='font-semibold text-foreground mb-1'>
                    Máxima Seguridad
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Autenticación robusta con verificación de correo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth Forms */}
          <Card className='shadow-professional'>
            <CardHeader>
              <CardTitle className='text-2xl'>Bienvenido</CardTitle>
              <CardDescription>
                Inicia sesión o crea una cuenta para comenzar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthTabs
                onEmailLogin={handleEmailLogin}
                onEmailRegister={handleEmailRegister}
                onGitHubLogin={handleGitHubLogin}
                isLoading={isLoading}
                message={message}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className='border-t bg-card mt-12'>
        <div className='container mx-auto px-4 py-6'>
          <div className='text-center text-sm text-muted-foreground'>
            <p>
              Sistema de Gestión Financiera © {new Date().getFullYear()} - SantiDev Development with ❤️.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
