import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authClient } from '@/lib/auth/client';
import Layout from '@/components/Layout';
import type { ExtendedSession } from '@/types/session';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { Edit, Shield, User as UserIcon, Loader2, Crown } from 'lucide-react';
import { StatCard } from '@/components/molecules/StatCard';
import { DataTableHeader } from '@/components/molecules/DataTableHeader';
import { Badge } from '@/components/atoms/Badge';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

const Users = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
    } catch {
      alert('Error al actualizar el usuario');
    }
  };

  if (isPending || loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
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
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const userCount = users.length - adminCount;

  return (
    <Layout user={extendedSession.user}>
      <div className='space-y-6 fade-in'>
        <div>
          <h2 className='text-3xl font-bold text-foreground'>
            Gestión de Usuarios
          </h2>
          <p className='mt-1 text-muted-foreground'>
            Administra los usuarios del sistema y sus permisos
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <StatCard
            title='Total Usuarios'
            value={users.length.toString()}
            icon={<UserIcon className='h-5 w-5' />}
          />
          <StatCard
            title='Administradores'
            value={adminCount.toString()}
            icon={<Crown className='h-5 w-5' />}
          />
          <StatCard
            title='Usuarios Regulares'
            value={userCount.toString()}
            icon={<Shield className='h-5 w-5' />}
          />
        </div>

        <Card className='shadow-professional'>
          <CardHeader>
            <DataTableHeader
              title='Lista de Usuarios'
              description={`${filteredUsers.length} usuario${
                filteredUsers.length !== 1 ? 's' : ''
              }`}
              searchProps={{
                value: searchTerm,
                onChange: (value: string) => setSearchTerm(value),
                placeholder: 'Buscar por nombre o email...',
              }}
            />
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className='py-12 text-center text-muted-foreground'>
                {searchTerm
                  ? 'No se encontraron usuarios'
                  : 'No hay usuarios registrados'}
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Registro</TableHead>
                      <TableHead className='text-right'>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className='hover:bg-muted/50'>
                        <TableCell>
                          <div className='flex items-center gap-3'>
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                user.role === 'ADMIN'
                                  ? 'bg-primary/10'
                                  : 'bg-muted'
                              }`}
                            >
                              {user.role === 'ADMIN' ? (
                                <Crown className='h-5 w-5 text-primary' />
                              ) : (
                                <UserIcon className='h-5 w-5 text-muted-foreground' />
                              )}
                            </div>
                            <div>
                              <div className='font-medium'>{user.name}</div>
                              <div className='text-sm text-muted-foreground'>
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='text-sm text-muted-foreground'>
                            {user.phone || 'Sin teléfono'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === 'ADMIN' ? 'default' : 'secondary'
                            }
                          >
                            {user.role === 'ADMIN'
                              ? 'Administrador'
                              : 'Usuario'}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-sm text-muted-foreground'>
                          {new Date(user.createdAt).toLocaleDateString(
                            'es-ES',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => handleEditClick(user)}
                          >
                            <Edit className='mr-2 h-4 w-4' />
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-2xl font-bold'>
                Editar Usuario
              </DialogTitle>
              <DialogDescription className='text-base'>
                Actualiza la información y permisos del usuario
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='mt-4 space-y-5'>
              <div>
                <Label htmlFor='name' className='text-sm font-semibold'>
                  Nombre Completo
                </Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder='Juan Pérez'
                  className='mt-1.5'
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
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder='+57 300 123 4567'
                  className='mt-1.5'
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
};

export default Users;
