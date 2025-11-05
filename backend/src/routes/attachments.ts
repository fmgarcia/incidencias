/**
 * Rutas de attachments
 */

import { Router } from 'express';
import { downloadAttachment, deleteAttachment } from '../controllers/attachmentsController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateJWT);

// Descargar archivo
router.get('/:id/download', downloadAttachment);

// Eliminar archivo
router.delete('/:id', authorizeRoles('admin', 'tech'), deleteAttachment);

export default router;
