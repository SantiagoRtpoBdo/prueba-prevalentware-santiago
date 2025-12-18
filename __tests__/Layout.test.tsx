import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '@/components/Layout';

// Mock de next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/dashboard',
    push: jest.fn(),
  }),
}));

// Mock de authClient
jest.mock('@/lib/auth/client', () => ({
  authClient: {
    signOut: jest.fn(),
  },
}));

describe('Layout Component', () => {
  it('debería renderizar el contenido cuando hay un usuario autenticado', () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'ADMIN',
    };

    render(
      <Layout user={mockUser}>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  it('debería mostrar navegación completa para administradores', () => {
    const mockAdmin = {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
    };

    render(
      <Layout user={mockAdmin}>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Movimientos')).toBeInTheDocument();
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Reportes')).toBeInTheDocument();
  });

  it('debería ocultar opciones de admin para usuarios regulares', () => {
    const mockUser = {
      name: 'Regular User',
      email: 'user@example.com',
      role: 'USER',
    };

    render(
      <Layout user={mockUser}>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Movimientos')).toBeInTheDocument();
    expect(screen.queryByText('Usuarios')).not.toBeInTheDocument();
    expect(screen.queryByText('Reportes')).not.toBeInTheDocument();
  });

  it('debería renderizar sin header cuando no hay usuario', () => {
    render(
      <Layout user={null}>
        <div>Public Content</div>
      </Layout>
    );

    expect(screen.getByText('Public Content')).toBeInTheDocument();
    expect(screen.queryByText('Salir')).not.toBeInTheDocument();
  });
});
