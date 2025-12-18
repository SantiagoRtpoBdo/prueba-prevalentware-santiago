import { requireAuth, requireAdmin } from '@/lib/api-helpers';
import { NextApiRequest, NextApiResponse } from 'next';

// Mock del módulo de autenticación
jest.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

import { auth } from '@/lib/auth';

describe('API Helpers', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    req = {
      headers: {},
      method: 'GET',
    };
    
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requireAuth', () => {
    it('debería retornar null y enviar 401 cuando no hay sesión', async () => {
      (auth.api.getSession as jest.Mock).mockResolvedValue(null);

      const result = await requireAuth(
        req as NextApiRequest,
        res as NextApiResponse
      );

      expect(result).toBeNull();
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'No autenticado' });
    });

    it('debería retornar el usuario cuando hay una sesión válida', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'ADMIN',
      };

      (auth.api.getSession as jest.Mock).mockResolvedValue({
        user: mockUser,
      });

      const result = await requireAuth(
        req as NextApiRequest,
        res as NextApiResponse
      );

      expect(result).toEqual({ user: mockUser });
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    it('debería retornar null y enviar 401 cuando no hay sesión', async () => {
      (auth.api.getSession as jest.Mock).mockResolvedValue(null);

      const result = await requireAdmin(
        req as NextApiRequest,
        res as NextApiResponse
      );

      expect(result).toBeNull();
      expect(statusMock).toHaveBeenCalledWith(401);
    });

    it('debería retornar null y enviar 403 cuando el usuario no es admin', async () => {
      (auth.api.getSession as jest.Mock).mockResolvedValue({
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'USER',
        },
      });

      const result = await requireAdmin(
        req as NextApiRequest,
        res as NextApiResponse
      );

      expect(result).toBeNull();
      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Acceso denegado. Se requiere rol de administrador',
      });
    });

    it('debería retornar el usuario cuando es administrador', async () => {
      const mockAdmin = {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
      };

      (auth.api.getSession as jest.Mock).mockResolvedValue({
        user: mockAdmin,
      });

      const result = await requireAdmin(
        req as NextApiRequest,
        res as NextApiResponse
      );

      expect(result).toEqual({ user: mockAdmin });
      expect(statusMock).not.toHaveBeenCalledWith(403);
    });
  });
});
