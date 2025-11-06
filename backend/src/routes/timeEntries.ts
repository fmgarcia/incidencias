/**
 * Rutas de time entries
 */

import { Router } from 'express';
import {
  addTimeEntry,
  listTimeEntries,
  deleteTimeEntry,
} from '../controllers/timeEntriesController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateJWT);

// Rutas para time entries de una incidencia específica
// Estas se montarán en /api/incidents/:incidentId/time-entries
export const incidentTimeEntriesRouter = Router({ mergeParams: true });
incidentTimeEntriesRouter.use(authenticateJWT);
incidentTimeEntriesRouter.get('/', listTimeEntries);
incidentTimeEntriesRouter.post('/', authorizeRoles('admin', 'tech'), addTimeEntry);

// Eliminar time entry por ID
router.delete('/:id', authorizeRoles('admin', 'tech'), deleteTimeEntry);

export default router;
