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
import { TrendingUp, Users, FileText, DollarSign } from 'lucide-react';
import Link from 'next/link';
import type { ExtendedSession } from '@/types/session';

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando...</p>
        </div>
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
      title: 'Gestión de Movimientos',
      description: 'Administra ingresos y egresos',
      icon: TrendingUp,
      href: '/transactions',
      color: 'bg-blue-500',
      show: true,
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Administra usuarios del sistema',
      icon: Users,
      href: '/users',
      color: 'bg-green-500',
      show: isAdmin,
    },
    {
      title: 'Reportes',
      description: 'Visualiza estadísticas y descarga reportes',
      icon: FileText,
      href: '/reports',
      color: 'bg-purple-500',
      show: isAdmin,
    },
  ];

  return (
    <Layout user={extendedSession.user as any}>
      <div className='space-y-6'>
        <div>
          <h2 className='text-3xl font-bold text-gray-900'>
            Bienvenido, {session.user.name}
          </h2>
          <p className='mt-2 text-gray-600'>
            Gestiona tus finanzas de manera eficiente desde un solo lugar
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {features.map(
            (feature) =>
              feature.show && (
                <Link key={feature.title} href={feature.href}>
                  <Card className='hover:shadow-lg transition-shadow cursor-pointer h-full'>
                    <CardHeader>
                      <div
                        className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                      >
                        <feature.icon className='h-6 w-6 text-white' />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className='text-sm text-blue-600 font-medium'>
                        Acceder →
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
          )}
        </div>

        {!isAdmin && (
          <Card className='bg-yellow-50 border-yellow-200'>
            <CardHeader>
              <CardTitle className='text-yellow-800'>Nota</CardTitle>
              <CardDescription className='text-yellow-700'>
                Tienes acceso limitado. Contacta con un administrador para
                obtener más permisos.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </Layout>
  );
}
