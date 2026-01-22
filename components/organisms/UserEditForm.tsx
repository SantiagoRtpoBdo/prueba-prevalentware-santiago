import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, User as UserIcon } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface UserEditFormProps {
  user: User;
  onSubmit: (data: {
    name: string;
    role: 'USER' | 'ADMIN';
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  onSuccess?: () => void;
}

export const UserEditForm: React.FC<UserEditFormProps> = ({
  user,
  onSubmit,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    role: user.role as 'USER' | 'ADMIN',
    phone: user.phone || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      name: user.name,
      role: user.role as 'USER' | 'ADMIN',
      phone: user.phone || '',
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.name) {
      setError('El nombre es requerido');
      setIsSubmitting(false);
      return;
    }

    const result = await onSubmit({
      name: formData.name,
      role: formData.role,
      phone: formData.phone || undefined,
    });

    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error || 'Error al actualizar el usuario');
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      {error && (
        <div className='p-3 rounded-lg text-sm bg-destructive/10 text-destructive border border-destructive/20'>
          {error}
        </div>
      )}

      <div>
        <Label htmlFor='name' className='text-sm font-semibold'>
          Nombre Completo
        </Label>
        <Input
          id='name'
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder='Juan Pérez'
          className='mt-1.5'
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor='role' className='text-sm font-semibold'>
          Rol del Usuario
        </Label>
        <Select
          value={formData.role}
          onValueChange={(value: 'USER' | 'ADMIN') =>
            setFormData({ ...formData, role: value })
          }
          disabled={isSubmitting}
        >
          <SelectTrigger className='mt-1.5'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='USER'>
              <div className='flex items-center gap-2'>
                <UserIcon className='h-4 w-4 text-muted-foreground' />
                <span>Usuario Regular</span>
              </div>
            </SelectItem>
            <SelectItem value='ADMIN'>
              <div className='flex items-center gap-2'>
                <Shield className='h-4 w-4 text-primary' />
                <span>Administrador</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor='phone' className='text-sm font-semibold'>
          Teléfono (Opcional)
        </Label>
        <Input
          id='phone'
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder='+57 300 123 4567'
          className='mt-1.5'
          disabled={isSubmitting}
        />
      </div>

      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    </form>
  );
};
