/**
 * Rutas de time entries
 */

import { Router } from 'express';
import { deleteTimeEntry } from '../controllers/timeEntriesController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateJWT);

// Eliminar time entry
router.delete('/:id', authorizeRoles('admin', 'tech'), deleteTimeEntry);

export default router;
