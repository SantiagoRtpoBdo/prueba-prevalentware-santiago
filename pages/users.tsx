import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import Layout from '@/components/Layout';
import { PageLoader } from '@/components/templates/PageLoader';
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
import { Edit, Shield, User as UserIcon, Crown } from 'lucide-react';
import { StatCard } from '@/components/molecules/StatCard';
import { DataTableHeader } from '@/components/molecules/DataTableHeader';
import { Badge } from '@/components/atoms/Badge';
import { UserEditForm } from '@/components/organisms/UserEditForm';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

const Users = () => {
  const { session, isPending, isAdmin, user } = useAuth({ requireAdmin: true });
  const { users, loading, updateUser, adminCount, userCount } = useUsers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleUpdateUser = async (data: {
    name: string;
    role: 'USER' | 'ADMIN';
    phone?: string;
  }) => {
    if (!selectedUser)
      return { success: false, error: 'Usuario no seleccionado' };

    const result = await updateUser(selectedUser.id, data);
    if (result.success) {
      setDialogOpen(false);
      setSelectedUser(null);
    }
    return result;
  };

  if (isPending || loading) {
    return <PageLoader />;
  }

  if (!session || !isAdmin || !user) {
    return null;
  }

  return (
    <Layout user={user}>
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

        {selectedUser && (
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
              <div className='mt-4'>
                <UserEditForm
                  user={selectedUser}
                  onSubmit={handleUpdateUser}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setSelectedUser(null);
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default Users;
