import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthTabsProps {
  onEmailLogin: (email: string, password: string) => Promise<void>;
  onEmailRegister: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  onGitHubLogin: () => Promise<void>;
  isLoading: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({
  onEmailLogin,
  onEmailRegister,
  onGitHubLogin,
  isLoading,
  message,
}) => (
  <Tabs defaultValue='login' className='w-full'>
    <TabsList className='grid w-full grid-cols-2'>
      <TabsTrigger value='login'>Iniciar Sesión</TabsTrigger>
      <TabsTrigger value='register'>Registrarse</TabsTrigger>
    </TabsList>

    <TabsContent value='login'>
      <LoginForm
        onLogin={onEmailLogin}
        onGitHubLogin={onGitHubLogin}
        isLoading={isLoading}
        message={message}
      />
    </TabsContent>

    <TabsContent value='register'>
      <RegisterForm
        onRegister={onEmailRegister}
        onGitHubLogin={onGitHubLogin}
        isLoading={isLoading}
        message={message}
      />
    </TabsContent>
  </Tabs>
);
