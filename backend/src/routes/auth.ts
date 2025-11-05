/**
 * Rutas de autenticación
 */

import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
  getAllUsers,
} from '../controllers/authController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema, changePasswordSchema } from '../validations/auth.schema';

const router = Router();

// Rutas públicas
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Rutas protegidas (requieren autenticación)
router.get('/me', authenticateJWT, getMe);
router.put('/me', authenticateJWT, updateMe);
router.post('/change-password', authenticateJWT, validate(changePasswordSchema), changePassword);

// Rutas de administración (solo admin)
router.get('/users', authenticateJWT, authorizeRoles('admin'), getAllUsers);

export default router;
