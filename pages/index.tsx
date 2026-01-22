import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  Mail,
  Lock,
  Github,
  Loader2,
  TrendingUp,
  Shield,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

const Home = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Estados para Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados para Registro
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await authClient.signIn.email({
        email: loginEmail,
        password: loginPassword,
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

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (registerPassword !== registerConfirmPassword) {
      setMessage({
        type: 'error',
        text: 'Las contraseñas no coinciden',
      });
      setIsLoading(false);
      return;
    }

    if (registerPassword.length < 8) {
      setMessage({
        type: 'error',
        text: 'La contraseña debe tener al menos 8 caracteres',
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await authClient.signUp.email({
        email: registerEmail,
        password: registerPassword,
        name: registerName,
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
        // Limpiar formulario
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterConfirmPassword('');
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
    <div className='min-h-screen bg-background'>
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

      <div className='container mx-auto px-4 py-12'>
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
              <Tabs defaultValue='login' className='w-full'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='login'>Iniciar Sesión</TabsTrigger>
                  <TabsTrigger value='register'>Registrarse</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value='login' className='space-y-4'>
                  <form onSubmit={handleEmailLogin} className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='login-email'>Correo Electrónico</Label>
                      <div className='relative'>
                        <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                        <Input
                          id='login-email'
                          type='email'
                          placeholder='tu@email.com'
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className='pl-10'
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='login-password'>Contraseña</Label>
                      <div className='relative'>
                        <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                        <Input
                          id='login-password'
                          type='password'
                          placeholder='••••••••'
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className='pl-10'
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {message && (
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          message.type === 'success'
                            ? 'bg-success/10 text-success border border-success/20'
                            : 'bg-destructive/10 text-destructive border border-destructive/20'
                        }`}
                      >
                        {message.text}
                      </div>
                    )}

                    <Button
                      type='submit'
                      className='w-full'
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Iniciando sesión...
                        </>
                      ) : (
                        'Iniciar Sesión'
                      )}
                    </Button>
                  </form>

                  <div className='relative'>
                    <div className='absolute inset-0 flex items-center'>
                      <span className='w-full border-t' />
                    </div>
                    <div className='relative flex justify-center text-xs uppercase'>
                      <span className='bg-card px-2 text-muted-foreground'>
                        O continúa con
                      </span>
                    </div>
                  </div>

                  <Button
                    type='button'
                    variant='outline'
                    className='w-full'
                    onClick={handleGitHubLogin}
                    disabled={isLoading}
                  >
                    <Github className='mr-2 h-4 w-4' />
                    GitHub
                  </Button>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value='register' className='space-y-4'>
                  <form onSubmit={handleEmailRegister} className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='register-name'>Nombre Completo</Label>
                      <Input
                        id='register-name'
                        type='text'
                        placeholder='Juan Pérez'
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='register-email'>Correo Electrónico</Label>
                      <div className='relative'>
                        <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                        <Input
                          id='register-email'
                          type='email'
                          placeholder='tu@email.com'
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className='pl-10'
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='register-password'>Contraseña</Label>
                      <div className='relative'>
                        <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                        <Input
                          id='register-password'
                          type='password'
                          placeholder='Mínimo 8 caracteres'
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className='pl-10'
                          required
                          disabled={isLoading}
                          minLength={8}
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='register-confirm'>
                        Confirmar Contraseña
                      </Label>
                      <div className='relative'>
                        <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                        <Input
                          id='register-confirm'
                          type='password'
                          placeholder='Repite tu contraseña'
                          value={registerConfirmPassword}
                          onChange={(e) =>
                            setRegisterConfirmPassword(e.target.value)
                          }
                          className='pl-10'
                          required
                          disabled={isLoading}
                          minLength={8}
                        />
                      </div>
                    </div>

                    {message && (
                      <div
                        className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                          message.type === 'success'
                            ? 'bg-success/10 text-success border border-success/20'
                            : 'bg-destructive/10 text-destructive border border-destructive/20'
                        }`}
                      >
                        {message.type === 'success' && (
                          <CheckCircle2 className='h-4 w-4 shrink-0 mt-0.5' />
                        )}
                        <span>{message.text}</span>
                      </div>
                    )}

                    <Button
                      type='submit'
                      className='w-full'
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Creando cuenta...
                        </>
                      ) : (
                        'Crear Cuenta'
                      )}
                    </Button>
                  </form>

                  <div className='text-xs text-center text-muted-foreground'>
                    Al registrarte, recibirás un correo de verificación. Debes
                    confirmar tu email antes de poder iniciar sesión.
                  </div>

                  <div className='relative'>
                    <div className='absolute inset-0 flex items-center'>
                      <span className='w-full border-t' />
                    </div>
                    <div className='relative flex justify-center text-xs uppercase'>
                      <span className='bg-card px-2 text-muted-foreground'>
                        O regístrate con
                      </span>
                    </div>
                  </div>

                  <Button
                    type='button'
                    variant='outline'
                    className='w-full'
                    onClick={handleGitHubLogin}
                    disabled={isLoading}
                  >
                    <Github className='mr-2 h-4 w-4' />
                    GitHub
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className='border-t bg-card mt-12'>
        <div className='container mx-auto px-4 py-6'>
          <div className='text-center text-sm text-muted-foreground'>
            <p>
              Sistema de Gestión Financiera © {new Date().getFullYear()} - Todos
              los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
