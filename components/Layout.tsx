import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, TrendingUp, Users, LogOut, FileText } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function Layout({ children, user }: LayoutProps) {
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
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Sistema de Gestión Financiera
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-gray-500">{user.email}</div>
              </div>
              <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                {user.role}
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigation.map(
              (item) =>
                item.show && (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors
                      ${
                        router.pathname === item.href
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                )
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
