import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authClient } from '@/lib/auth/client';
import Layout from '@/components/Layout';
import type { ExtendedSession } from '@/types/session';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Shield, User as UserIcon } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

export default function Users() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'USER' as 'USER' | 'ADMIN',
    phone: '',
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/');
    } else if (session) {
      const extendedSession = session as unknown as ExtendedSession;
      if (extendedSession.user.role !== 'ADMIN') {
        router.push('/dashboard');
      } else {
        fetchUsers();
      }
    }
  }, [session, isPending, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      role: user.role as 'USER' | 'ADMIN',
      phone: user.phone || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al actualizar el usuario');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error al actualizar el usuario');
    }
  };

  if (isPending || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando...</p>
        </div>
      </div>
    );
  }

  if (
    !session ||
    (session as unknown as ExtendedSession).user.role !== 'ADMIN'
  ) {
    return null;
  }

  const extendedSession = session as unknown as ExtendedSession;

  return (
    <Layout user={extendedSession.user as any}>
      <div className='space-y-6'>
        <div>
          <h2 className='text-3xl font-bold text-gray-900'>
            Gestión de Usuarios
          </h2>
          <p className='mt-2 text-gray-600'>
            Administra los usuarios del sistema y sus roles
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                No hay usuarios registrados
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Fecha de Registro</TableHead>
                    <TableHead className='text-right'>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className='font-medium'>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || '-'}</TableCell>
                      <TableCell>
                        <div className='flex items-center'>
                          {user.role === 'ADMIN' ? (
                            <>
                              <Shield className='h-4 w-4 text-blue-600 mr-2' />
                              <span className='text-blue-600 font-semibold'>
                                Administrador
                              </span>
                            </>
                          ) : (
                            <>
                              <UserIcon className='h-4 w-4 text-gray-600 mr-2' />
                              <span className='text-gray-600'>Usuario</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit className='h-4 w-4 mr-2' />
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Actualiza la información del usuario
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <Label htmlFor='name'>Nombre</Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder='Nombre completo'
                />
              </div>
              <div>
                <Label htmlFor='role'>Rol</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: 'USER' | 'ADMIN') =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='USER'>Usuario</SelectItem>
                    <SelectItem value='ADMIN'>Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='phone'>Teléfono</Label>
                <Input
                  id='phone'
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder='+57 300 123 4567'
                />
              </div>
              <Button type='submit' className='w-full'>
                Guardar Cambios
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
