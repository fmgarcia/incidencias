/**
 * Rutas de comentarios
 */

import { Router } from 'express';
import { updateComment, deleteComment } from '../controllers/commentsController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateJWT);

// Actualizar comentario
router.put('/:id', updateComment);

// Eliminar comentario
router.delete('/:id', authorizeRoles('admin', 'tech'), deleteComment);

export default router;
