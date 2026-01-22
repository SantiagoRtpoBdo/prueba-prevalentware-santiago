import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import { PageLoader } from '@/components/templates/PageLoader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingUp, Users, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Dashboard = () => {
  const { session, isPending, isAdmin, user } = useAuth();

  if (isPending) {
    return <PageLoader />;
  }

  if (!session || !user) {
    return null;
  }

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
    <Layout user={user}>
      <div className='space-y-6 fade-in'>
        <div>
          <h2 className='text-2xl font-bold text-foreground'>
            Bienvenido, {user.name}
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
