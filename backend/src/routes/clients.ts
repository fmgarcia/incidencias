/**
 * Rutas de clientes
 */

import { Router } from 'express';
import {
  listClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from '../controllers/clientsController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createClientSchema, updateClientSchema } from '../validations/client.schema';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateJWT);

// Listar clientes (todos los roles autenticados)
router.get('/', listClients);

// Obtener cliente por ID
router.get('/:id', getClientById);

// Crear cliente (admin, tech)
router.post('/', authorizeRoles('admin', 'tech'), validate(createClientSchema), createClient);

// Actualizar cliente (admin, tech)
router.put('/:id', authorizeRoles('admin', 'tech'), validate(updateClientSchema), updateClient);
router.patch('/:id', authorizeRoles('admin', 'tech'), validate(updateClientSchema), updateClient);

// Eliminar cliente (solo admin)
router.delete('/:id', authorizeRoles('admin'), deleteClient);

export default router;
