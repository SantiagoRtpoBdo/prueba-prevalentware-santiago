import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Error al cargar los usuarios');
      }
    } catch (err) {
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = useCallback(
    async (userId: string, userData: { name: string; role: 'USER' | 'ADMIN'; phone?: string }) => {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          await fetchUsers();
          return { success: true };
        } else {
          const error = await response.json();
          return { success: false, error: error.error || 'Error al actualizar el usuario' };
        }
      } catch {
        return { success: false, error: 'Error al actualizar el usuario' };
      }
    },
    [fetchUsers]
  );

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const userCount = users.length - adminCount;

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    updateUser,
    adminCount,
    userCount,
  };
};
