import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { authClient } from '@/lib/auth/client';
import Layout from '@/components/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingUp, Users, FileText, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { ExtendedSession } from '@/types/session';

const Dashboard = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const extendedSession = session as unknown as ExtendedSession;
  const isAdmin = extendedSession.user.role === 'ADMIN';

  const features = [
    {
      title: 'Movimientos',
      description: 'Administra ingresos y egresos',
      icon: TrendingUp,
      href: '/transactions',
      show: true,
    },
    {
      title: 'Usuarios',
      description: 'Gestiona usuarios y permisos',
      icon: Users,
      href: '/users',
      show: isAdmin,
    },
    {
      title: 'Reportes',
      description: 'Visualiza estadísticas y reportes',
      icon: FileText,
      href: '/reports',
      show: isAdmin,
    },
  ];

  return (
    <Layout user={extendedSession.user}>
      <div className='space-y-6 fade-in'>
        <div>
          <h2 className='text-2xl font-bold text-foreground'>
            Bienvenido, {session.user.name}
          </h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            {isAdmin ? 'Panel de Administración' : 'Panel de Usuario'}
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {features.map(
            (feature) =>
              feature.show && (
                <Link key={feature.title} href={feature.href}>
                  <Card className='h-full hover-card cursor-pointer'>
                    <CardHeader className='pb-4'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3'>
                        <feature.icon className='h-6 w-6' />
                      </div>
                      <CardTitle className='text-lg'>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='flex items-center gap-2 text-sm text-primary font-medium'>
                        <span>Acceder</span>
                        <ArrowRight className='h-4 w-4' />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
          )}
        </div>

        {/* Info for non-admin */}
        {!isAdmin && (
          <Card className='border-warning/20 bg-warning/5'>
            <CardHeader>
              <CardTitle className='text-base'>Acceso Limitado</CardTitle>
              <CardDescription>
                Contacta con un administrador para obtener permisos adicionales.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
