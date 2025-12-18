import type { NextApiRequest, NextApiResponse } from 'next';
import { swaggerDocument } from '@/lib/swagger';

/**
 * GET /api/docs - Documentación de la API con OpenAPI/Swagger
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(swaggerDocument);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}
