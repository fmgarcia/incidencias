/**
 * Rutas para catálogos (estados, prioridades, severidades, etc.)
 */

import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../db/client';
import { authenticateJWT } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateJWT);

/**
 * Obtener todos los estados
 * GET /api/statuses
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const statuses = await prisma.status.findMany({
      orderBy: { display_order: 'asc' },
    });

    res.json({ statuses });
  })
);

/**
 * Obtener todas las prioridades
 * GET /api/priorities
 */
router.get(
  '/priorities',
  asyncHandler(async (req: Request, res: Response) => {
    const priorities = await prisma.priority.findMany({
      orderBy: { display_order: 'asc' },
    });

    res.json({ priorities });
  })
);

export default router;
