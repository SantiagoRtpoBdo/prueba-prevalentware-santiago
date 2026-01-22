import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  LogOut,
  FileText,
  Building2,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    role?: string;
  } | null;
}

const Layout = ({ children, user }: LayoutProps) => {
  const router = useRouter();
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  const navigation = [
    {
      name: 'Inicio',
      href: '/dashboard',
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: 'Movimientos',
      href: '/transactions',
      icon: TrendingUp,
      show: true,
    },
    {
      name: 'Usuarios',
      href: '/users',
      icon: Users,
      show: isAdmin,
    },
    {
      name: 'Reportes',
      href: '/reports',
      icon: FileText,
      show: isAdmin,
    },
  ];

  if (!user) {
    return <div className='min-h-screen bg-background'>{children}</div>;
  }

  return (
    <div className='min-h-screen bg-secondary/30'>
      {/* Professional Header */}
      <header className='sticky top-0 z-50 bg-card border-b border-border shadow-subtle'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo and Title */}
            <div className='flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
                <Building2 className='h-5 w-5' />
              </div>
              <div>
                <h1 className='text-base font-semibold text-foreground'>
                  Sistema de Gestión Financiera
                </h1>
              </div>
            </div>

            {/* User info and actions */}
            <div className='flex items-center gap-4'>
              <div className='text-sm text-right hidden md:block'>
                <div className='font-medium text-foreground'>{user.name}</div>
                <div className='text-xs text-muted-foreground'>{user.role}</div>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleLogout}
                className='gap-2'
              >
                <LogOut className='h-4 w-4' />
                <span className='hidden sm:inline'>Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Professional Navigation */}
      <nav className='sticky top-16 z-40 bg-card border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex space-x-1'>
            {navigation.map(
              (item) =>
                item.show && (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-fast
                      ${
                        router.pathname === item.href
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <item.icon className='h-4 w-4' />
                    <span>{item.name}</span>

                    {/* Active indicator */}
                    {router.pathname === item.href && (
                      <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />
                    )}
                  </Link>
                )
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 fade-in'>
        {children}
      </main>

      {/* Footer */}
      <footer className='mt-auto py-4 border-t border-border bg-card'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center text-xs text-muted-foreground'>
            <p>© 2026 Sistema de Gestión Financiera</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default Layout;
