import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Github, Loader2, CheckCircle2 } from 'lucide-react';

interface RegisterFormProps {
  onRegister: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  onGitHubLogin: () => Promise<void>;
  isLoading: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onGitHubLogin,
  isLoading,
  message,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // La validación se maneja en el componente padre
      return;
    }

    if (password.length < 8) {
      // La validación se maneja en el componente padre
      return;
    }

    await onRegister(name, email, password, confirmPassword);
  };

  return (
    <div className='space-y-4'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='register-name'>Nombre Completo</Label>
          <Input
            id='register-name'
            type='text'
            placeholder='Juan Pérez'
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='pl-10'
              required
              disabled={isLoading}
              minLength={8}
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='register-confirm'>Confirmar Contraseña</Label>
          <div className='relative'>
            <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <Input
              id='register-confirm'
              type='password'
              placeholder='Repite tu contraseña'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

        <Button type='submit' className='w-full' disabled={isLoading}>
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
        Al registrarte, recibirás un correo de verificación. Debes confirmar tu
        email antes de poder iniciar sesión.
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
        onClick={onGitHubLogin}
        disabled={isLoading}
      >
        <Github className='mr-2 h-4 w-4' />
        GitHub
      </Button>
    </div>
  );
};
