/**
 * Rutas de incidencias
 */

import { Router } from 'express';
import {
  listIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  changeIncidentStatus,
  closeIncident,
  deleteIncident,
  getIncidentsSummary,
} from '../controllers/incidentsController';
import { addTimeEntry, listTimeEntries } from '../controllers/timeEntriesController';
import { addComment, listComments } from '../controllers/commentsController';
import { uploadAttachment, listAttachments, upload } from '../controllers/attachmentsController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createIncidentSchema,
  updateIncidentSchema,
  changeStatusSchema,
  incidentQuerySchema,
  createTimeEntrySchema,
  createCommentSchema,
} from '../validations/incident.schema';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateJWT);

// Resumen de incidencias
router.get('/summary', getIncidentsSummary);

// Listar incidencias con filtros
router.get('/', validate(incidentQuerySchema, 'query'), listIncidents);

// Obtener incidencia por ID
router.get('/:id', getIncidentById);

// Crear incidencia (todos excepto viewer)
router.post(
  '/',
  authorizeRoles('admin', 'tech', 'user'),
  validate(createIncidentSchema),
  createIncident
);

// Actualizar incidencia (admin, tech)
router.put('/:id', authorizeRoles('admin', 'tech'), validate(updateIncidentSchema), updateIncident);

// Cambiar estado de incidencia (admin, tech)
router.patch(
  '/:id/status',
  authorizeRoles('admin', 'tech'),
  validate(changeStatusSchema),
  changeIncidentStatus
);

// Cerrar incidencia (admin, tech)
router.patch('/:id/close', authorizeRoles('admin', 'tech'), closeIncident);

// Eliminar/Archivar incidencia (solo admin)
router.delete('/:id', authorizeRoles('admin'), deleteIncident);

// ========== SUBRUTAS: TIME ENTRIES ==========

// Listar time entries de una incidencia
router.get('/:incidentId/time-entries', listTimeEntries);

// Añadir time entry a una incidencia
router.post(
  '/:incidentId/time-entries',
  authorizeRoles('admin', 'tech'),
  validate(createTimeEntrySchema),
  addTimeEntry
);

// ========== SUBRUTAS: COMMENTS ==========

// Listar comentarios de una incidencia
router.get('/:incidentId/comments', listComments);

// Añadir comentario a una incidencia
router.post('/:incidentId/comments', validate(createCommentSchema), addComment);

// ========== SUBRUTAS: ATTACHMENTS ==========

// Listar archivos de una incidencia
router.get('/:incidentId/attachments', listAttachments);

// Subir archivo a una incidencia
router.post('/:incidentId/attachments', upload.single('file'), uploadAttachment);

export default router;
