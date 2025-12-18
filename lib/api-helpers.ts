import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from './auth';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
  };
}

/**
 * Middleware para verificar autenticación
 */
export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ user: any } | null> {
  const session = await auth.api.getSession({
    headers: req.headers as any,
  });

  if (!session) {
    res.status(401).json({ error: 'No autenticado' });
    return null;
  }

  return { user: session.user };
}

/**
 * Middleware para verificar rol de administrador
 */
export async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ user: any } | null> {
  const authResult = await requireAuth(req, res);
  if (!authResult) return null;

  if (authResult.user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' });
    return null;
  }

  return authResult;
}

/**
 * Manejador de errores
 */
export function handleError(res: NextApiResponse, error: any) {
  console.error('API Error:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: error.message || 'Ocurrió un error inesperado',
  });
}
