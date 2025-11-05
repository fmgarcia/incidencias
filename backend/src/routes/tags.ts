/**
 * Rutas de tags
 */

import { Router } from 'express';
import { listTags, createTag, deleteTag } from '../controllers/tagsController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateJWT);

// Listar tags
router.get('/', listTags);

// Crear tag (admin, tech)
router.post('/', authorizeRoles('admin', 'tech'), createTag);

// Eliminar tag (solo admin)
router.delete('/:id', authorizeRoles('admin'), deleteTag);

export default router;
